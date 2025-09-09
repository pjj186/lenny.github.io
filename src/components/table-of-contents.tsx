import React, { useEffect, useState, useMemo, useCallback } from "react"
import { ChevronRight, List } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

interface TableOfContentsProps {
  tableOfContents: string
  className?: string
}

// HTML 문자열을 파싱해서 구조화된 데이터로 변환
const parseTableOfContents = (html: string): TableOfContentsItem[] => {
  if (!html || html.trim() === "") return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const links = doc.querySelectorAll("a[href^='#']")

  const items: TableOfContentsItem[] = []

  links.forEach(link => {
    const href = link.getAttribute("href")
    const title = link.textContent?.trim()

    if (href && title) {
      // href에서 #을 제거하고 URL 디코딩 적용
      let id = href.replace("#", "")
      try {
        // URL 인코딩된 한글을 디코딩
        id = decodeURIComponent(id)
      } catch (error) {
        // 디코딩 실패 시 원본 사용
      }

      // UL의 중첩 깊이로 레벨 계산
      let element = link.parentElement
      let level = 1

      while (element) {
        if (element.tagName === "UL") {
          const parentLi = element.parentElement?.closest("li")
          if (parentLi) {
            level++
          }
        }
        element = element.parentElement
      }

      items.push({
        id,
        title,
        level,
      })
    }
  })

  return items
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  tableOfContents,
  className = "",
}) => {
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const tocItems = useMemo(
    () => parseTableOfContents(tableOfContents),
    [tableOfContents]
  )

  // 부드러운 스크롤 이동 (useCallback으로 메모이제이션)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement> | Event, id: string) => {
      e.preventDefault()

      // 다단계 요소 찾기 시스템
      let element = document.getElementById(id)

      if (!element) {
        // URL 인코딩된 ID로도 시도
        try {
          const encodedId = encodeURIComponent(id)
          element = document.getElementById(encodedId)
        } catch (error) {
          // 인코딩 실패 시 무시
        }
      }

      if (!element) {
        // querySelector로 attribute selector 사용
        element = document.querySelector(`[id="${id}"]`)
      }

      if (!element) {
        // 대소문자 무시하고 ID로 찾기
        const headings = document.querySelectorAll(
          "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
        )
        element =
          (Array.from(headings).find(
            h => h.id.toLowerCase() === id.toLowerCase()
          ) as HTMLElement) || null
      }

      if (!element) {
        // 텍스트 기반으로 헤딩 찾기
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
        const coreKeyword = id.split("-")[0]?.toLowerCase() || ""

        element =
          (Array.from(headings).find(h => {
            const text = h.textContent?.trim().toLowerCase() || ""

            if (text === id.toLowerCase()) return true
            if (text.startsWith(coreKeyword)) return true

            const cleanText = text.replace(/[()]/g, "").trim()
            if (cleanText.includes(coreKeyword)) return true

            return false
          }) as HTMLElement) || null
      }

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
    if (!tocItems.length) {
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
  }, [tocItems])

  if (!tocItems.length) {
    return null
  }

  const TocContent = () => (
    <ScrollArea className="h-full max-h-[60vh] pr-3">
      <div className="space-y-1">
        {tocItems.map(item => (
          <div key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={e => handleClick(e, item.id)}
              className={`
                block py-2 px-3 text-sm rounded-lg transition-all duration-200
                ${item.level === 1 ? "font-medium" : ""}
                ${item.level === 2 ? "ml-3 text-muted-foreground" : ""}
                ${item.level === 3 ? "ml-6 text-muted-foreground text-xs" : ""}
                ${item.level >= 4 ? "ml-9 text-muted-foreground text-xs" : ""}
                ${
                  activeId === item.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                }
              `}
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
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
        <div className="border rounded-lg p-4 bg-card/30 backdrop-blur-sm">
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
