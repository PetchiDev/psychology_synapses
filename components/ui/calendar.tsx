"use client"

import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker, getDefaultClassNames, type DayButton } from "react-day-picker"

import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = "label",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-1 [--cell-size:2.75rem] sm:[--cell-size:3.25rem]",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        formatWeekdayName: (date) => date.toLocaleString("en-GB", { weekday: "short" }).slice(0, 2),
        ...formatters,
      }}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-5", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-11 p-0 hover:bg-shadow aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-11 p-0 hover:bg-shadow aria-disabled:pointer-events-none aria-disabled:opacity-30",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-11 w-full items-center justify-center px-12",
          defaultClassNames.month_caption
        ),
        dropdowns: cn("flex h-11 w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
        dropdown_root: cn("relative rounded-md border border-input", defaultClassNames.dropdown_root),
        dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "font-serif text-[1.35rem] tracking-tight text-shadow select-none",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 pb-2 text-[0.7rem] font-semibold tracking-[0.14em] text-coffee uppercase select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn("text-[0.8rem] text-muted-foreground select-none", defaultClassNames.week_number),
        day: cn(
          "group/day relative flex aspect-square h-full w-full items-center justify-center p-0.5 text-center select-none",
          defaultClassNames.day
        ),
        range_start: cn("rounded-l-full bg-latte", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-full bg-latte", defaultClassNames.range_end),
        today: cn("", defaultClassNames.today),
        outside: cn("text-coffee/50", defaultClassNames.outside),
        disabled: cn("text-coffee/35", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-5", className)} {...props} />
          if (orientation === "right") return <ChevronRightIcon className={cn("size-5", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-today={modifiers.today || undefined}
      className={cn(
        "relative flex size-full max-h-(--cell-size) max-w-(--cell-size) cursor-pointer items-center justify-center rounded-full text-[0.95rem] font-medium text-shadow tabular-nums transition-[background-color,color,transform,box-shadow] duration-300 ease-(--ease-paper) outline-none",
        "hover:bg-latte/70 focus-visible:ring-[3px] focus-visible:ring-burgundy/40",
        "disabled:cursor-not-allowed disabled:font-normal disabled:text-coffee/35 disabled:line-through disabled:decoration-coffee/30 disabled:hover:bg-transparent",
        "data-[today=true]:after:absolute data-[today=true]:after:bottom-1.5 data-[today=true]:after:left-1/2 data-[today=true]:after:size-1 data-[today=true]:after:-translate-x-1/2 data-[today=true]:after:rounded-full data-[today=true]:after:bg-burgundy",
        "data-[selected-single=true]:scale-105 data-[selected-single=true]:bg-burgundy data-[selected-single=true]:text-paper data-[selected-single=true]:shadow-[0_10px_20px_-10px_rgb(106_31_38/0.9)] data-[selected-single=true]:after:bg-paper",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
