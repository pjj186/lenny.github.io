import React, { useEffect, useRef } from "react"

const Utterances: React.FC = () => {
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!commentsRef.current) return

    // 현재 테마 감지
    const isDark = document.documentElement.classList.contains("dark")
    const theme = isDark ? "github-dark" : "github-light"

    // 기존 스크립트 제거
    commentsRef.current.innerHTML = ""

    // Utterances 스크립트 생성
    const script = document.createElement("script")
    script.src = "https://utteranc.es/client.js"
    script.setAttribute("repo", "pjj186/blog-comments")
    script.setAttribute("issue-term", "pathname")
    script.setAttribute("theme", theme)
    script.setAttribute("crossorigin", "anonymous")
    script.async = true

    commentsRef.current.appendChild(script)

    // 테마 변경 감지 함수
    const handleThemeChange = () => {
      const iframe =
        document.querySelector<HTMLIFrameElement>(".utterances-frame")
      if (iframe && iframe.contentWindow) {
        const newTheme = document.documentElement.classList.contains("dark")
          ? "github-dark"
          : "github-light"

        const message = {
          type: "set-theme",
          theme: newTheme,
        }
        iframe.contentWindow.postMessage(message, "https://utteranc.es")
      }
    }

    // 테마 변경 감지를 위한 MutationObserver
    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="mt-16 pt-8 border-t">
      <h3 className="text-xl font-semibold mb-6">댓글</h3>
      <div ref={commentsRef} className="utterances-container" />
    </div>
  )
}

export default Utterances
