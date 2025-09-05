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
exports.createPages = async ({ graphql, actions, reporter }) => {
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

  const posts = result.data.allMarkdownRemark.nodes
  console.log(`총 ${posts.length}개의 포스트를 찾았습니다.`)

  // 1. 개별 블로그 포스트 페이지 생성
  if (posts.length > 0) {
    posts.forEach((post, index) => {
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

    posts.forEach(post => {
      if (post.frontmatter.category) {
        categories.add(post.frontmatter.category)
      }
      if (post.frontmatter.tags && Array.isArray(post.frontmatter.tags)) {
        post.frontmatter.tags.forEach(tag => tags.add(tag))
      }
    })

    console.log(`찾은 카테고리들:`, Array.from(categories))
    console.log(`찾은 태그들:`, Array.from(tags))

    const postsPerPage = 5 // 페이지당 포스트 수

    // 3. 카테고리별 페이지 생성
    if (categories.size > 0) {
      Array.from(categories).forEach(category => {
        const categoryPosts = posts.filter(
          post => post.frontmatter.category === category
        )
        const totalPages = Math.ceil(categoryPosts.length / postsPerPage)

        console.log(
          `카테고리 "${category}": ${categoryPosts.length}개 포스트, ${totalPages}페이지`
        )

        for (let i = 0; i < totalPages; i++) {
          const currentPage = i + 1
          const pathPrefix = `/category/${category
            .toLowerCase()
            .replace(/\s+/g, "-")}`
          const pagePath =
            currentPage === 1 ? pathPrefix : `${pathPrefix}/${currentPage}`

          console.log(`카테고리 페이지 생성: ${pagePath}`)

          createPage({
            path: pagePath,
            component: categoryTemplate,
            context: {
              category,
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
      Array.from(tags).forEach(tag => {
        const tagPosts = posts.filter(
          post => post.frontmatter.tags && post.frontmatter.tags.includes(tag)
        )
        const totalPages = Math.ceil(tagPosts.length / postsPerPage)

        console.log(
          `태그 "#${tag}": ${tagPosts.length}개 포스트, ${totalPages}페이지`
        )

        for (let i = 0; i < totalPages; i++) {
          const currentPage = i + 1
          const pathPrefix = `/tag/${tag
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
              tag,
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
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
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
    }

    type Fields {
      slug: String
    }
  `)
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@/components": path.resolve(__dirname, "src/components"),
        "@/lib/utils": path.resolve(__dirname, "src/lib/utils"),
      },
    },
  })
}
