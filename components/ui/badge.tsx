import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-200",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}