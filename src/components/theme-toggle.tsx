"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isChecked = theme === 'dark'
  
  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch 
        id="theme-switch" 
        checked={isChecked}
        onCheckedChange={handleToggle}
      />
      <Moon className="h-5 w-5" />
      <Label htmlFor="theme-switch" className="sr-only">Toggle theme</Label>
    </div>
  )
}
