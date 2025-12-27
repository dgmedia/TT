'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Film, 
  Palette, 
  Type, 
  Globe, 
  Save, 
  FolderOpen,
  BarChart3,
  Layers
} from 'lucide-react'

const navItems = [
  { 
    label: 'Design',
    items: [
      { name: 'Media', href: '/studio?panel=media', icon: Film },
      { name: 'Colors', href: '/studio?panel=colors', icon: Palette },
      { name: 'Content', href: '/studio?panel=content', icon: Type },
    ]
  },
  {
    label: 'Community',
    items: [
      { name: 'Gallery', href: '/studio?panel=gallery', icon: Globe },
      { name: 'Save', href: '/studio?panel=save', icon: Save },
      { name: 'Load', href: '/studio?panel=load', icon: FolderOpen },
    ]
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPanel = searchParams.get('panel') || 'media'

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Pebble Studio</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-6">
        {navItems.map((section) => (
          <div key={section.label}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-3">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = item.href.includes('panel=') 
                  ? item.href.includes(`panel=${currentPanel}`)
                  : pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive 
                        ? 'bg-secondary text-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Ready
        </div>
      </div>
    </aside>
  )
}
