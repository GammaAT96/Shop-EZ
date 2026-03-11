import * as React from 'react'
import { cn } from '@/lib/utils'

export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { type?: string; collapsible?: boolean }) {
  return <div className={cn(className)} {...props} />
}

export function AccordionItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  return <div className={cn(className)} {...props} />
}

export function AccordionTrigger({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn('flex w-full items-center justify-between py-3 text-left', className)}
      type="button"
      {...props}
    />
  )
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pb-4 text-sm', className)} {...props} />
}

