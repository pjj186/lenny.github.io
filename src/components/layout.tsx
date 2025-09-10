import React from "react"
import Header from "./header"

const Layout = ({
  location,
  title,
  children,
}: {
  location?: any
  title?: any
  children?: any
}) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header isRootPath={isRootPath} title={title} />

      {/* Main Content - flex-grow로 남은 공간을 모두 차지 */}
      <main className="flex-grow">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer - 항상 화면 하단에 고정 */}
      <footer className="mt-auto border-t bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Keep Going
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
