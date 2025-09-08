import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "@/components/bio"
import Layout from "@/components/layout"
import Seo from "@/components/seo"
import CategoryTag from "@/components/category-tag"
import TableOfContents from "@/components/table-of-contents"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface BlogPostTemplateProps {
  data: {
    previous: {
      fields: {
        slug: string
        autoDate?: string
      }
      frontmatter: {
        title: string
      }
    } | null
    next: {
      fields: {
        slug: string
        autoDate?: string
      }
      frontmatter: {
        title: string
      }
    } | null
    site: {
      siteMetadata: {
        title: string
      }
    }
    markdownRemark: {
      id: string
      excerpt: string
      html: string
      tableOfContents: string
      frontmatter: {
        title: string
        date?: string
        description?: string
        category?: string
        tags?: string[]
        thumbnail?: {
          childImageSharp?: {
            gatsbyImageData?: any
          }
        }
      }
      fields: {
        slug: string
        autoDate?: string
      }
    }
  }
  location: any
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <div className="relative">
        {/* 메인 콘텐츠 */}
        <article
          className="blog-post max-w-4xl mx-auto px-4 py-8"
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
                  <time className="text-sm">
                    {post.frontmatter.date || post.fields?.autoDate}
                  </time>
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

          {/* 모바일 목차 */}
          {post.tableOfContents && (
            <div className="mb-8 lg:hidden">
              <TableOfContents tableOfContents={post.tableOfContents} />
            </div>
          )}

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
                  <Link
                    to={next.fields.slug}
                    rel="next"
                    className="group block"
                  >
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
        </article>

        {/* 데스크톱 사이드바 목차 - 우측 여백에 절대 위치 */}
        {post.tableOfContents && (
          <aside className="hidden xl:block fixed right-20 top-1/2 transform -translate-y-1/2 w-64 max-h-[70vh] overflow-y-auto z-10 2xl:right-32">
            <TableOfContents tableOfContents={post.tableOfContents} />
          </aside>
        )}
      </div>
    </Layout>
  )
}

export const Head: React.FC<BlogPostTemplateProps> = ({
  data: { markdownRemark: post },
  location,
}) => {
  const thumbnail =
    post.frontmatter.thumbnail?.childImageSharp?.gatsbyImageData?.images
      ?.fallback?.src
  const fullUrl = `https://pjj186.github.io${location.pathname}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description || post.excerpt,
    author: {
      "@type": "Person",
      name: "Lenny",
      url: "https://pjj186.github.io",
    },
    datePublished: post.frontmatter.date || post.fields?.autoDate,
    dateModified: post.frontmatter.date || post.fields?.autoDate,
    url: fullUrl,
    image: thumbnail
      ? `https://pjj186.github.io${thumbnail}`
      : "https://pjj186.github.io/icons/icon-512x512.png",
    publisher: {
      "@type": "Organization",
      name: "Lenny.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://pjj186.github.io/icons/icon-512x512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  }

  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      pathname={location.pathname}
      image={thumbnail}
      article={true}
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Seo>
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
      tableOfContents(
        absolute: false
        pathToSlugField: "fields.slug"
        maxDepth: 3
      )
      frontmatter {
        title
        date(formatString: "YYYY년 MM월 DD일 HH:mm:ss")
        description
        category
        tags
        thumbnail {
          childImageSharp {
            gatsbyImageData(
              width: 1200
              height: 630
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
      fields {
        slug
        autoDate(formatString: "YYYY년 MM월 DD일 HH:mm:ss")
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
        autoDate(formatString: "YYYY년 MM월 DD일")
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
        autoDate(formatString: "YYYY년 MM월 DD일")
      }
      frontmatter {
        title
      }
    }
  }
`
