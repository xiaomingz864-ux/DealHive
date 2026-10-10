import Link from 'next/link'
import type { SiteSettings } from '@/lib/types'

interface FooterProps {
  settings: SiteSettings | null
}

export function Footer({ settings }: FooterProps) {
  const name = settings?.site_name || 'DealHive'
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">{name}</h3>
            <p className="text-sm text-slate-500">
              {settings?.site_tagline ||
                'Discover the best Amazon deals and coupon codes every day.'}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Explore</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/deals" className="hover:text-orange-600">
                  All Deals
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-600">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-600">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-orange-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/privacy-policy" className="hover:text-orange-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-orange-600">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-600">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          <p>
            © {year} {name}. As an Amazon Associate we earn from qualifying
            purchases.
          </p>
          <p className="mt-1">
            Prices and availability are accurate as of the date/time indicated
            and are subject to change.
          </p>
        </div>
      </div>
    </footer>
  )
}
