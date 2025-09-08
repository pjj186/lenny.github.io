/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import GitHubIcon from "@mui/icons-material/GitHub"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bg-card border rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-start space-x-4">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0">
          <StaticImage
            className="rounded-full border-2 border-border"
            src="../images/profile-pic.jpeg"
            width={64}
            height={64}
            quality={95}
            alt="Profile picture"
            placeholder="blurred"
            formats={["auto", "webp"]}
          />
        </div>

        {/* 텍스트 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {author?.name && (
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {author.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-1 whitespace-pre-line">
                  {author?.summary || null}
                </p>
              </div>

              {/* 소셜 링크 */}
              {social?.github && (
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://github.com/${social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-full transition-colors duration-200"
                  >
                    <GitHubIcon className="mr-1" fontSize="small" />
                    Github
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bio
