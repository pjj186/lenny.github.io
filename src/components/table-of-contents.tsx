import React, { useEffect, useState, useCallback, useRef } from "react"
import { ChevronRight, List } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

interface TableOfContentsProps {
  tableOfContents: string
  className?: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  tableOfContents,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  // 목차 링크 클릭 이벤트 처리
  const handleTocClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (link) {
        e.preventDefault()
        const href = link.getAttribute("href")
        if (href) {
          const id = decodeURIComponent(href.replace("#", ""))
          const element = document.getElementById(id)

          if (element) {
            const offsetTop = element.offsetTop - 100
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            })
          }

          // 모바일에서는 클릭 후 접기
          if (isMobile) {
            setIsOpen(false)
          }
        }
      }
    },
    [isMobile]
  )

  // 화면 크기 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // 데스크톱에서는 항상 열어두기
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // IntersectionObserver를 이용한 현재 섹션 하이라이트
  useEffect(() => {
    if (!tableOfContents || !tableOfContents.trim()) {
      return
    }

    // IntersectionObserver 참조 저장
    let observer: IntersectionObserver | null = null

    // DOM이 완전히 로드된 후 실행하기 위한 약간의 지연
    const timer = setTimeout(() => {
      // 모든 헤딩 요소를 미리 찾기
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6")
      )

      if (!headings.length) {
        return
      }

      // 매우 간단한 IntersectionObserver 설정
      observer = new IntersectionObserver(
        entries => {
          // 현재 보이는 헤딩들
          const visibleHeadings = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visibleHeadings.length > 0) {
            const activeHeading = visibleHeadings[0]!.target as HTMLElement
            setActiveId(activeHeading.id)
          }
        },
        {
          // 매우 간단한 설정
          rootMargin: "-100px 0px -50% 0px",
          threshold: 0.1,
        }
      )

      // 모든 헤딩 관찰
      headings.forEach(heading => {
        if (heading.id) {
          observer?.observe(heading)
        }
      })
    }, 100) // 100ms 지연

    return () => {
      clearTimeout(timer)
      if (observer) {
        observer.disconnect()
      }
    }
  }, [tableOfContents])

  // 활성 링크 스타일 업데이트
  useEffect(() => {
    if (!tocRef.current) return

    const links = tocRef.current.querySelectorAll('a[href^="#"]')

    links.forEach(link => {
      const href = link.getAttribute("href")
      if (href) {
        const id = decodeURIComponent(href.replace("#", ""))
        if (id === activeId) {
          link.classList.add("toc-active")
        } else {
          link.classList.remove("toc-active")
        }
      }
    })
  }, [activeId])

  if (!tableOfContents || !tableOfContents.trim()) {
    return null
  }

  const TocContent = () => (
    <ScrollArea className="h-full max-h-[60vh] pr-3">
      <div
        ref={tocRef}
        className="toc-content"
        dangerouslySetInnerHTML={{ __html: tableOfContents }}
        onClick={handleTocClick}
      />
    </ScrollArea>
  )

  return (
    <div className={`sticky top-24 ${className}`}>
      {isMobile ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between mb-4"
              size="sm"
            >
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span>목차</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="border rounded-lg p-4 bg-card">
              <TocContent />
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="border rounded-lg p-4 bg-card/50 backdrop-blur-sm shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <List className="w-4 h-4" />
            <span className="font-semibold text-sm">목차</span>
          </div>
          <Separator className="mb-4" />
          <TocContent />
        </div>
      )}
    </div>
  )
}

export default TableOfContents
