/**
 * 이 파일에서 Gatsby의 Node API를 구현합니다.
 *
 * 참조: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// 블로그 포스트를 위한 템플릿 정의
const blogPost = path.resolve(`./src/templates/blog-post.tsx`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // 날짜순으로 정렬된 모든 마크다운 블로그 포스트를 가져옵니다
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
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

  // 블로그 포스트 페이지 생성
  // 단, "content/blog" 디렉토리(gatsby-config.js에 정의됨)에 하나 이상의 마크다운 파일이 있어야 합니다
  // `context`는 템플릿에서 prop으로 사용할 수 있고, GraphQL에서 변수로도 사용 가능합니다

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

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
