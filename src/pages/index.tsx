import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Bio from "@/components/bio"
import Layout from "@/components/layout"
import Seo from "@/components/seo"
import CategoryTag from "@/components/category-tag"
import CategoryFilter from "@/components/category-filter"

const BlogIndex = ({ data, location }: { data: any; location: any }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          블로그 포스트를 찾을 수 없습니다. "content/blog"
          디렉토리(gatsby-config.js에 정의됨)에 하나 이상의 마크다운 파일이
          있어야 합니다.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />

      {/* 카테고리 필터 */}
      <CategoryFilter />

      <div className="space-y-8">
        {posts.map((post: any) => {
          const title = post.frontmatter.title || post.fields.slug
          const thumbnail = getImage(post.frontmatter.thumbnail)

          return (
            <article
              key={post.fields.slug}
              className="group bg-card hover:bg-card/80 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              itemScope
              itemType="http://schema.org/Article"
            >
              <Link to={post.fields.slug} className="block">
                <div className="flex flex-col md:flex-row">
                  {/* 썸네일 이미지 */}
                  <div className="md:w-80 w-full h-48 md:h-auto flex-shrink-0 overflow-hidden">
                    {thumbnail ? (
                      <GatsbyImage
                        image={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 콘텐츠 영역 */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <header className="mb-3">
                        <h2
                          className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                          itemProp="headline"
                        >
                          {title}
                        </h2>
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

                      {/* 카테고리와 태그 */}
                      <div className="mb-3">
                        <CategoryTag
                          category={post.frontmatter.category}
                          tags={post.frontmatter.tags}
                          showLinks={true}
                        />
                      </div>

                      <section>
                        <p
                          className="text-muted-foreground leading-relaxed line-clamp-3"
                          itemProp="description"
                        >
                          {post.frontmatter.description ||
                            post.excerpt.replace(/<[^>]*>/g, "")}
                        </p>
                      </section>
                    </div>

                    <div className="mt-4">
                      <span className="text-primary text-sm font-medium group-hover:underline">
                        자세히 읽기 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="모든 포스트" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
          autoDate
        }
        frontmatter {
          date(formatString: "YYYY년 MM월 DD일")
          title
          description
          category
          tags
          thumbnail {
            childImageSharp {
              gatsbyImageData(
                width: 300
                height: 200
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
  }
`
