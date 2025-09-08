import React, { useState, useEffect } from "react"
import { List, ChevronDown, ChevronRight } from "lucide-react"

interface TableOfContentsProps {
  tableOfContents: string
  className?: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  tableOfContents,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      }
    )

    // 모든 헤딩 요소 관찰
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    headings.forEach(heading => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (href) {
      const targetId = href.replace("#", "")
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
        setActiveId(targetId)
      }
    }
  }

  if (!tableOfContents) return null

  return (
    <div className={`bg-card border rounded-lg ${className}`}>
      {/* 모바일에서 토글 가능한 헤더 */}
      <button
        className="flex items-center justify-between w-full p-4 text-left md:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <List className="w-4 h-4" />
          <span className="font-medium">목차</span>
        </div>
        <div className="md:hidden">
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* 목차 내용 */}
      <div className={`${isOpen ? "block" : "hidden"} md:block px-4 pb-4`}>
        <div
          className="toc-content text-sm"
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
          onClick={e => {
            const target = e.target as HTMLElement
            if (target.tagName === "A") {
              handleClick(e as any)
            }
          }}
        />
      </div>
    </div>
  )
}

export default TableOfContents
