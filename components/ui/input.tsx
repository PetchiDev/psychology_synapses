import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-input bg-[#fffaf1]/70 px-4 py-2 text-base text-shadow shadow-[inset_0_1px_2px_rgb(43_30_26/0.06)] transition-[border-color,box-shadow,background-color] duration-300 outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-coffee/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-coffee/60 focus-visible:border-burgundy focus-visible:bg-[#fffaf1] focus-visible:ring-[3px] focus-visible:ring-burgundy/15 focus-visible:outline-none",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
