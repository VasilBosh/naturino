import * as React from "react"

// Олекотена версия: същият вид като преди, но без библиотеката tailwind-merge (~24 KB по-малко JS).
// Базовите класове, които винаги се презаписват от формата (височина, фон, заобляне, рамка, сянка),
// са махнати оттук, за да няма конфликти.
const BASE =
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 w-full min-w-0 border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm " +
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"

function Input({ className = "", type, ...props }: React.ComponentProps<"input">) {
  const has = (re: RegExp) => re.test(className)
  const defaults = [
    has(/(^|\s)h-/) ? "" : "h-9",
    has(/(^|\s)rounded/) ? "" : "rounded-md",
    has(/(^|\s)bg-/) ? "" : "bg-transparent",
    has(/(^|\s)shadow/) ? "" : "shadow-xs",
    has(/(^|\s)border-(?!\d)[a-z]/) ? "" : "border-input",
    has(/(^|\s)transition/) ? "" : "transition-[color,box-shadow]",
  ].filter(Boolean).join(" ")

  // Ако са подадени два фона (напр. bg-white + bg-red-50/40 при грешка) — важи последният,
  // точно както беше с tailwind-merge.
  const parts = className.split(/\s+/).filter(Boolean)
  const lastBg = parts.filter((c) => c.startsWith("bg-")).pop()
  const cleaned = parts.filter((c) => !c.startsWith("bg-") || c === lastBg).join(" ")

  return (
    <input
      type={type}
      data-slot="input"
      className={`${BASE} ${defaults} ${cleaned}`.trim()}
      {...props}
    />
  )
}

export { Input }
