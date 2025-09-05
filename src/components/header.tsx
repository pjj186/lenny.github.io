import { Link } from "gatsby"
import React from "react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { MoonIcon, SunIcon } from "lucide-react"

interface HeaderProps {
  isRootPath: boolean
  title: string
}

const Header = ({ isRootPath, title }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 cursor-pointer"
          >
            {theme === "dark" ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
