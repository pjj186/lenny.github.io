import * as React from "react"
import { Link } from "gatsby"

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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {isRootPath ? (
              <h1 className="text-2xl font-bold tracking-tight">
                <Link
                  to="/"
                  className="hover:text-foreground/80 transition-colors"
                >
                  {title}
                </Link>
              </h1>
            ) : (
              <Link
                to="/"
                className="text-xl font-semibold hover:text-foreground/80 transition-colors"
              >
                {title}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - flex-grow로 남은 공간을 모두 차지 */}
      <main className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
