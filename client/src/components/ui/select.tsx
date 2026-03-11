import * as React from 'react'
import { cn } from '@/lib/utils'

type SelectItemData = { value: string; label: React.ReactNode }

function collectItems(children: React.ReactNode): SelectItemData[] {
  const items: SelectItemData[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyChild: any = child
    if (anyChild?.type?.displayName === 'SelectItem') {
      items.push({ value: String(anyChild.props.value), label: anyChild.props.children })
    } else if (anyChild.props?.children) {
      items.push(...collectItems(anyChild.props.children))
    }
  })
  return items
}

type SelectContextValue = {
  value?: string
  setValue?: (v: string) => void
  placeholder?: string
  items: SelectItemData[]
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

export function Select({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (v: string) => void
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlledValue ?? uncontrolled
  const items = React.useMemo(() => collectItems(children), [children])

  const setValue = (v: string) => {
    onValueChange?.(v)
    if (controlledValue === undefined) setUncontrolled(v)
  }

  return <SelectContext.Provider value={{ value, setValue, items }}>{children}</SelectContext.Provider>
}

export function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(SelectContext)
  const val = ctx?.value
  return (
    <div className={cn('relative', className)} {...props}>
      <select
        className={cn(
          'h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
        )}
        value={val}
        onChange={(e) => ctx?.setValue?.(e.target.value)}
      >
        {!val && <option value="">Select...</option>}
        {ctx?.items.map((it) => (
          <option key={it.value} value={it.value}>
            {String(it.label)}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">{children}</div>
    </div>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)
  if (!ctx?.value) return <span className="text-slate-400">{placeholder}</span>
  const item = ctx.items.find((i) => i.value === ctx.value)
  return <span className="text-slate-900">{item?.label ?? ctx.value}</span>
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function SelectItem({ children }: { value: string; children: React.ReactNode }) {
  return <>{children}</>
}
SelectItem.displayName = 'SelectItem'

