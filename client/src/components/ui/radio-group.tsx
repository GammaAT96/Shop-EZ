import * as React from 'react'
import { cn } from '@/lib/utils'

export function RadioGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid gap-2', className)} {...props} />
}

export function RadioGroupItem(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" {...props} />
}

