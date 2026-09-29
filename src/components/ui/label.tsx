import * as React from "react"

// Олекотена версия без Radix и tailwind-merge. Всички етикети във формата
// сами задават размер/дебелина/разстояние, затова тук остава само общото.
function Label({ className = "", ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={`leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${className}`.trim()}
      {...props}
    />
  )
}

export { Label }
