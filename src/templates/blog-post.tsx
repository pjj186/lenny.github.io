import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "@/components/bio"
import Layout from "@/components/layout"
import Seo from "@/components/seo"
import CategoryTag from "@/components/category-tag"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      {/* 메인 아티클 */}
      <article
        className="max-w-none"
        itemScope
        itemType="http://schema.org/Article"
      >
        {/* 헤더 섹션 */}
        <header className="mb-12">
          <div className="space-y-4">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
              itemProp="headline"
            >
              {post.frontmatter.title}
            </h1>

            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <time className="text-sm">{post.frontmatter.date}</time>
              </div>
            </div>

            {/* 카테고리와 태그 */}
            <div className="pt-2">
              <CategoryTag
                category={post.frontmatter.category}
                tags={post.frontmatter.tags}
                showLinks={true}
              />
            </div>
          </div>
        </header>

        {/* 본문 내용 */}
        <section
          className="markdown-content max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />

        {/* Bio 섹션 */}
        <div className="mt-16 pt-8 border-t">
          <Bio />
        </div>
      </article>

      {/* 이전/다음 포스트 네비게이션 */}
      <nav className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 이전 포스트 */}
          <div className="md:justify-self-start">
            {previous && (
              <Link
                to={previous.fields.slug}
                rel="prev"
                className="group block"
              >
                <div className="bg-card hover:bg-card/80 border rounded-lg p-6 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-muted rounded-full group-hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground mb-1">
                        이전 포스트
                      </p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {previous.frontmatter.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* 다음 포스트 */}
          <div className="md:justify-self-end">
            {next && (
              <Link to={next.fields.slug} rel="next" className="group block">
                <div className="bg-card hover:bg-card/80 border rounded-lg p-6 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-sm text-muted-foreground mb-1">
                        다음 포스트
                      </p>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {next.frontmatter.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 p-2 bg-muted rounded-full group-hover:bg-muted/80 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY년 MM월 DD일")
        description
        category
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
