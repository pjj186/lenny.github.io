import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  className?: string
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  className = "",
}) => {
  const data = useStaticQuery(graphql`
    query CategoryFilterQuery {
      allMarkdownRemark {
        group(field: { frontmatter: { category: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const categories = data.allMarkdownRemark.group

  if (!categories || categories.length === 0) return null

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-lg font-semibold mb-4 text-foreground">
        카테고리별 보기
      </h2>
      <div className="flex flex-wrap gap-2">
        {/* 전체 보기 버튼 */}
        <Button variant="outline" asChild>
          <Link to="/">
            📚 전체 (
            {categories.reduce(
              (sum: number, cat: any) => sum + cat.totalCount,
              0
            )}
            )
          </Link>
        </Button>

        {/* 카테고리별 버튼들 */}
        {categories.map((category: any) => (
          <Button key={category.fieldValue} variant="outline" asChild>
            <Link
              to={`/category/${category.fieldValue
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              📁 {category.fieldValue} ({category.totalCount})
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
