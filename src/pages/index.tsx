import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import Bio from "@/components/bio"
import Layout from "@/components/layout"
import Seo from "@/components/seo"
import CategoryTag from "@/components/category-tag"
import CategoryFilter from "@/components/category-filter"
import { Button } from "@/components/ui/button"

const BlogIndex = ({ data, location }: { data: any; location: any }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = React.useState(1)
  const postsPerPage = 5 // 페이지당 포스트 수
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // 현재 페이지에 해당하는 포스트만 가져오기
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = posts.slice(startIndex, endIndex)

  // 페이지 번호 생성 로직 (스마트한 표시)
  const getPageNumbers = () => {
    const pages = []
    const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수

    // 첫 페이지는 항상 표시
    pages.push(1)

    if (totalPages <= 7) {
      // 페이지가 7개 이하면 모두 표시
      for (let i = 2; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        // 시작 부분에 있을 때
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 끝 부분에 있을 때
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 중간에 있을 때
        pages.push("...")
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

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
        {currentPosts.map((post: any) => {
          const title = post.frontmatter.title || post.fields.slug
          const thumbnail = getImage(post.frontmatter.thumbnail)

          return (
            <article
              key={post.fields.slug}
              className="group bg-card hover:bg-card/80 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              itemScope
              itemType="http://schema.org/Article"
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
                        <h2
                          className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary hover:text-primary transition-colors line-clamp-2"
                          itemProp="headline"
                        >
                          {title}
                        </h2>
                      </Link>
                      <time className="text-sm text-muted-foreground mt-1 block">
                        {post.frontmatter.date || post.fields?.autoDate}
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
                      <p
                        className="text-muted-foreground leading-relaxed line-clamp-3"
                        itemProp="description"
                      >
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
        <nav className="flex items-center justify-center gap-1 mt-12">
          {/* 이전 페이지 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="gap-1 pl-2.5"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          {/* 페이지 번호들 */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((pageNum, index) => {
              if (pageNum === "...") {
                return (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                )
              }

              const isCurrentPage = pageNum === currentPage

              return (
                <Button
                  key={pageNum}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(pageNum as number)}
                  disabled={isCurrentPage}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          {/* 다음 페이지 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="gap-1 pr-2.5"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      )}
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
    allMarkdownRemark(
      sort: [{ frontmatter: { date: DESC } }, { fields: { autoDate: DESC } }]
    ) {
      nodes {
        excerpt
        fields {
          slug
          autoDate(formatString: "YYYY년 MM월 DD일")
        }
        frontmatter {
          date(formatString: "YYYY년 MM월 DD일")
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
    }
  }
`
