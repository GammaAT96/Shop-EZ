import * as React from 'react'
import { cn } from '@/lib/utils'

export const Avatar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100', className)} {...props} />
)

export const AvatarImage = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img className={cn('aspect-square h-full w-full object-cover', className)} {...props} />
)

export const AvatarFallback = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex h-full w-full items-center justify-center text-sm font-medium text-slate-600', className)} {...props} />
)

