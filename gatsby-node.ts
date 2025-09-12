/**
 * 이 파일에서 Gatsby의 Node API를 구현합니다.
 *
 * 참조: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// 템플릿 정의
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
const categoryTemplate = path.resolve(`./src/templates/category.tsx`)
const tagTemplate = path.resolve(`./src/templates/tag.tsx`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({
  graphql,
  actions,
  reporter,
}: import("gatsby").CreatePagesArgs) => {
  const { createPage } = actions

  // 모든 마크다운 블로그 포스트와 메타데이터를 가져옵니다
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            category
            tags
            title
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `블로그 포스트를 불러오는 중 오류가 발생했습니다`,
      result.errors
    )
    return
  }

  const posts = (result.data as any)?.allMarkdownRemark?.nodes || []
  console.log(`총 ${posts.length}개의 포스트를 찾았습니다.`)

  // 1. 개별 블로그 포스트 페이지 생성
  if (posts.length > 0) {
    posts.forEach((post: any, index: number) => {
      // posts는 최신순 정렬 (DESC)
      // previous: 시간상 이전 포스트 (더 오래된 포스트) = index + 1
      // next: 시간상 다음 포스트 (더 최신 포스트) = index - 1
      const previousPostId =
        index === posts.length - 1 ? null : posts[index + 1].id
      const nextPostId = index === 0 ? null : posts[index - 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
    console.log(`${posts.length}개의 블로그 포스트 페이지를 생성했습니다.`)

    // 2. 카테고리 수집 및 페이지 생성
    const categories = new Set()
    const tags = new Set()

    posts.forEach((post: any) => {
      if (post.frontmatter.category) {
        categories.add(post.frontmatter.category)
      }
      if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
        post.frontmatter.tags.forEach((tag: string) => tags.add(tag))
      }
    })

    console.log(`찾은 카테고리들:`, Array.from(categories))
    console.log(`찾은 태그들:`, Array.from(tags))

    const postsPerPage = 5 // 페이지당 포스트 수

    // 3. 카테고리별 페이지 생성
    if (categories.size > 0) {
      Array.from(categories).forEach((category: unknown) => {
        const categoryString = category as string
        const categoryPosts = posts.filter(
          (post: any) => post.frontmatter.category === categoryString
        )
        const totalPages = Math.ceil(categoryPosts.length / postsPerPage)

        console.log(
          `카테고리 "${category}": ${categoryPosts.length}개 포스트, ${totalPages}페이지`
        )

        for (let i = 0; i < totalPages; i++) {
          const currentPage = i + 1
          const pathPrefix = `/category/${categoryString
            .toLowerCase()
            .replace(/\s+/g, "-")}`
          const pagePath =
            currentPage === 1 ? pathPrefix : `${pathPrefix}/${currentPage}`

          console.log(`카테고리 페이지 생성: ${pagePath}`)

          createPage({
            path: pagePath,
            component: categoryTemplate,
            context: {
              category: categoryString,
              currentPage,
              totalPages,
              limit: postsPerPage,
              skip: i * postsPerPage,
            },
          })
        }
      })
    }

    // 4. 태그별 페이지 생성
    if (tags.size > 0) {
      Array.from(tags).forEach((tag: unknown) => {
        const tagString = tag as string
        const tagPosts = posts.filter(
          (post: any) =>
            post.frontmatter.tags && post.frontmatter.tags.includes(tagString)
        )
        const totalPages = Math.ceil(tagPosts.length / postsPerPage)

        console.log(
          `태그 "#${tag}": ${tagPosts.length}개 포스트, ${totalPages}페이지`
        )

        for (let i = 0; i < totalPages; i++) {
          const currentPage = i + 1
          const pathPrefix = `/tag/${tagString
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9가-힣-]/g, "")}`
          const pagePath =
            currentPage === 1 ? pathPrefix : `${pathPrefix}/${currentPage}`

          console.log(`태그 페이지 생성: ${pagePath}`)

          createPage({
            path: pagePath,
            component: tagTemplate,
            context: {
              tag: tagString,
              currentPage,
              totalPages,
              limit: postsPerPage,
              skip: i * postsPerPage,
            },
          })
        }
      })
    }
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({
  node,
  actions,
  getNode,
}: import("gatsby").CreateNodeArgs) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    const fileNode = getNode(node.parent as string)

    createNodeField({
      name: `slug`,
      node,
      value,
    })

    // frontmatter에 date가 없으면 파일 생성 시간을 사용
    if (!(node.frontmatter as any)?.date && fileNode) {
      const birthTime =
        (fileNode as any)?.birthTime || (fileNode as any)?.ctime || new Date()

      // 한국 시간대로 조정 (UTC+9)
      const dateObj = new Date(birthTime as string | number | Date)
      const koreanTime = new Date(dateObj.getTime() + 9 * 60 * 60 * 1000)
      const koreanISODate = koreanTime.toISOString()

      console.log(
        `자동 날짜 생성: ${node.id} -> ${koreanISODate} (원본: ${birthTime}, 한국시간 조정됨)`
      )

      createNodeField({
        name: `autoDate`,
        node,
        value: koreanISODate,
      })
    }
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({
  actions,
}: import("gatsby").CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions

  // siteMetadata {} 객체를 명시적으로 정의합니다
  // 이렇게 하면 gatsby-config.js에서 삭제되더라도 항상 정의된 상태로 유지됩니다

  // 또한 Markdown frontmatter를 명시적으로 정의합니다
  // 이렇게 하면 "content/blog" 내에 블로그 포스트가 없더라도 "MarkdownRemark" 쿼리는
  // 오류 대신 `null`을 반환합니다
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      category: String
      tags: [String]
      thumbnail: File @fileByRelativePath
    }

    type Fields {
      slug: String
      autoDate: Date @dateformat
    }
  `)
}

exports.onCreateWebpackConfig = ({
  actions,
}: import("gatsby").CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@/components": path.resolve(__dirname, "src/components"),
        "@/lib/utils": path.resolve(__dirname, "src/lib/utils"),
      },
    },
  })
}
