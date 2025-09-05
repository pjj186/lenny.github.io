import React from "react"
import { Link } from "gatsby"

interface CategoryTagProps {
  category?: string
  tags?: string[]
  showLinks?: boolean
  className?: string
}

export const CategoryTag: React.FC<CategoryTagProps> = ({
  category,
  tags,
  showLinks = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* 카테고리 표시 */}
      {category && (
        <div className="flex items-center">
          {showLinks ? (
            <Link
              to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              📁 {category}
            </Link>
          ) : (
            <span className="inline-flex items-center px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              📁 {category}
            </span>
          )}
        </div>
      )}

      {/* 태그들 표시 */}
      {tags && tags.length > 0 && (
        <>
          {tags.map(tag => (
            <div key={tag}>
              {showLinks ? (
                <Link
                  to={`/tag/${tag
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9가-힣-]/g, "")}`}
                  className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md hover:bg-secondary/80 transition-colors"
                >
                  #{tag}
                </Link>
              ) : (
                <span className="inline-flex items-center px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                  #{tag}
                </span>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default CategoryTag
