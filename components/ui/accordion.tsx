"use client"

import * as React from "react"
import { cn } from "cn"
import { Plus } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-coffee/20 last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  headingLevel?: 2 | 3 | 4
}) {
  const Heading = `h${headingLevel}` as const
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex font-sans">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            "group/trigger flex flex-1 cursor-pointer items-start justify-between gap-6 rounded-lg py-6 text-left font-serif text-[1.2rem] leading-snug text-shadow transition-colors outline-none hover:text-burgundy focus-visible:ring-[3px] focus-visible:ring-burgundy/25 disabled:pointer-events-none disabled:opacity-50 sm:text-[1.4rem]",
            className
          )}
          {...props}
        >
          {children}
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-coffee/30 transition-[background-color,color,transform,border-color] duration-500 ease-(--ease-paper) group-hover/trigger:border-burgundy group-data-[state=open]/trigger:rotate-45 group-data-[state=open]/trigger:border-burgundy group-data-[state=open]/trigger:bg-burgundy group-data-[state=open]/trigger:text-paper"
          >
            <Plus className="size-4" />
          </span>
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-base data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-7 pr-12 leading-relaxed text-shadow/85", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
