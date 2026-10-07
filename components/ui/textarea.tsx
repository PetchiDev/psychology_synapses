import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-36 w-full rounded-xl border border-input bg-[#fffaf1]/70 px-4 py-3 text-base leading-relaxed text-shadow shadow-[inset_0_1px_2px_rgb(43_30_26/0.06)] transition-[border-color,box-shadow,background-color] duration-300 outline-none placeholder:text-coffee/70 hover:border-coffee/60 focus-visible:border-burgundy focus-visible:bg-[#fffaf1] focus-visible:ring-[3px] focus-visible:ring-burgundy/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
