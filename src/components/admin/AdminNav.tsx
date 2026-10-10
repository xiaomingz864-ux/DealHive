'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Tag,
  Package,
  FolderOpen,
  FileText,
  File,
  Settings,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/deals', label: 'Deals', icon: Tag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/pages', label: 'Pages', icon: File },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-0.5 p-3">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition',
              active
                ? 'bg-orange-50 text-orange-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
