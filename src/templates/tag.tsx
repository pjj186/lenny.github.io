import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "@/components/layout"
import Seo from "@/components/seo"
import CategoryTag from "@/components/category-tag"
import Pagination from "@/components/pagination"

interface TagTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string
      }
    }
    allMarkdownRemark: {
      nodes: Array<{
        excerpt: string
        fields: {
          slug: string
          autoDate: string
        }
        frontmatter: {
          date: string
          title: string
          description?: string
          category?: string
          tags?: string[]
          thumbnail?: {
            childImageSharp: any
          }
        }
      }>
      totalCount: number
    }
  }
  location: any
  pageContext: {
    tag: string
    currentPage: number
    totalPages: number
    limit: number
    skip: number
  }
}

const TagTemplate: React.FC<TagTemplateProps> = ({
  data,
  location,
  pageContext,
}) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const { tag, currentPage, totalPages } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      {/* 태그 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">#{tag} 태그</h1>
        <p className="text-muted-foreground">
          {data.allMarkdownRemark.totalCount}개의 포스트가 있습니다.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            이 태그가 포함된 포스트가 없습니다.
          </p>
          <Link
            to="/"
            className="text-primary hover:underline mt-2 inline-block"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      ) : (
        <>
          {/* 포스트 목록 */}
          <div className="space-y-8">
            {posts.map(post => {
              const title = post.frontmatter.title || post.fields.slug
              const thumbnail = getImage(
                post.frontmatter.thumbnail?.childImageSharp
              )

              return (
                <article
                  key={post.fields.slug}
                  className="group bg-card hover:bg-card/80 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 썸네일 이미지 - 클릭 가능 */}
                    <Link
                      to={post.fields.slug}
                      className="md:w-96 w-full aspect-video flex-shrink-0 overflow-hidden block rounded-lg"
                    >
                      {thumbnail ? (
                        <GatsbyImage
                          image={thumbnail}
                          alt={title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* 콘텐츠 영역 */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <header className="mb-3">
                          {/* 제목 - 클릭 가능 */}
                          <Link to={post.fields.slug}>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary hover:text-primary transition-colors line-clamp-2">
                              {title}
                            </h2>
                          </Link>
                          <time className="text-sm text-muted-foreground mt-1 block">
                            {post.frontmatter.date ||
                              (post.fields?.autoDate
                                ? `${post.fields.autoDate.slice(
                                    0,
                                    4
                                  )}년 ${post.fields.autoDate.slice(
                                    5,
                                    7
                                  )}월 ${post.fields.autoDate.slice(8, 10)}일`
                                : "")}
                          </time>
                        </header>

                        {/* 카테고리와 태그 - 독립적인 링크 */}
                        <div className="mb-3">
                          <CategoryTag
                            category={post.frontmatter.category}
                            tags={post.frontmatter.tags}
                            showLinks={true}
                          />
                        </div>

                        <section>
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {post.frontmatter.description ||
                              post.excerpt.replace(/<[^>]*>/g, "")}
                          </p>
                        </section>
                      </div>

                      {/* 자세히 읽기 버튼 - 클릭 가능 */}
                      <div className="mt-4">
                        <Link
                          to={post.fields.slug}
                          className="text-primary text-sm font-medium hover:underline inline-block"
                        >
                          자세히 읽기 →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pathPrefix={`/tag/${tag
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9가-힣-]/g, "")}/`}
              />
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export const Head: React.FC<TagTemplateProps> = ({ pageContext }) => {
  return (
    <Seo
      title={`#${pageContext.tag} 태그`}
      description={`#${pageContext.tag} 태그가 포함된 모든 포스트를 확인해보세요.`}
    />
  )
}

export default TagTemplate

export const pageQuery = graphql`
  query TagPostsByTag($tag: String!, $limit: Int!, $skip: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        excerpt
        fields {
          slug
          autoDate
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
          tags
          thumbnail {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
            }
          }
        }
      }
      totalCount
    }
  }
`
