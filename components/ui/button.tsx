import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-[0.01em] whitespace-nowrap transition-[background-color,color,box-shadow,transform,border-color] duration-300 ease-(--ease-paper) outline-none select-none focus-visible:ring-[3px] focus-visible:ring-burgundy/35 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "btn-shimmer bg-burgundy text-paper shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_10px_24px_-14px_rgb(106_31_38/0.9)] hover:bg-burgundy-deep hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_16px_30px_-14px_rgb(106_31_38/0.95)] hover:[&_svg]:translate-x-0.5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-coffee/45 bg-transparent text-shadow hover:border-shadow hover:bg-shadow hover:text-paper hover:[&_svg]:translate-x-0.5",
        secondary:
          "bg-latte text-shadow hover:bg-[#cdb497] hover:[&_svg]:translate-x-0.5",
        paper:
          "btn-shimmer bg-paper text-burgundy shadow-paper hover:bg-white hover:[&_svg]:translate-x-0.5",
        ghost:
          "text-shadow hover:bg-shadow/5",
        link: "rounded-none px-0 text-burgundy underline decoration-burgundy/30 decoration-1 underline-offset-[6px] hover:decoration-burgundy",
      },
      size: {
        default: "h-11 px-5 has-[>svg]:px-4",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 has-[>svg]:px-3.5",
        lg: "h-12 px-7 text-[0.95rem] has-[>svg]:px-6",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
