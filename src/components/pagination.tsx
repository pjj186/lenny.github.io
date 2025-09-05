import React from "react"
import { Link } from "gatsby"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  pathPrefix?: string
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pathPrefix = "/",
  className = "",
}) => {
  if (totalPages <= 1) return null

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const prevPage =
    currentPage - 1 === 1 ? pathPrefix : `${pathPrefix}${currentPage - 1}`

  const nextPage = `${pathPrefix}${currentPage + 1}`

  // 페이지 번호 생성 로직
  const getPageNumbers = () => {
    const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [1]

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* 이전 페이지 */}
      {!isFirstPage && (
        <Button variant="outline" size="sm" asChild>
          <Link to={prevPage} rel="prev">
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전
          </Link>
        </Button>
      )}

      {/* 페이지 번호들 */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-muted-foreground"
              >
                ...
              </span>
            )
          }

          const pageNumber = pageNum as number
          const isCurrentPage = pageNumber === currentPage
          const pagePath =
            pageNumber === 1 ? pathPrefix : `${pathPrefix}${pageNumber}`

          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              asChild={!isCurrentPage}
              disabled={isCurrentPage}
            >
              {isCurrentPage ? (
                <span>{pageNumber}</span>
              ) : (
                <Link to={pagePath}>{pageNumber}</Link>
              )}
            </Button>
          )
        })}
      </div>

      {/* 다음 페이지 */}
      {!isLastPage && (
        <Button variant="outline" size="sm" asChild>
          <Link to={nextPage} rel="next">
            다음
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      )}
    </nav>
  )
}

export default Pagination
