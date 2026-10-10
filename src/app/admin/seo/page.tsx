import Link from 'next/link'

export default function AdminSeoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">SEO Settings</h1>
      <p className="mb-6 text-slate-600">
        Edit meta titles, descriptions and slugs on each content type:
      </p>
      <ul className="space-y-3">
        <li>
          <Link href="/admin/settings" className="text-orange-600 hover:underline">
            Site-wide default meta →
          </Link>
        </li>
        <li>
          <Link href="/admin/deals" className="text-orange-600 hover:underline">
            Deal SEO fields →
          </Link>
        </li>
        <li>
          <Link href="/admin/products" className="text-orange-600 hover:underline">
            Product SEO fields →
          </Link>
        </li>
        <li>
          <Link href="/admin/categories" className="text-orange-600 hover:underline">
            Category SEO fields →
          </Link>
        </li>
        <li>
          <Link href="/admin/articles" className="text-orange-600 hover:underline">
            Article SEO fields →
          </Link>
        </li>
        <li>
          <Link href="/admin/pages" className="text-orange-600 hover:underline">
            Page SEO fields →
          </Link>
        </li>
      </ul>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Built-in SEO features</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>XML sitemap at /sitemap.xml</li>
          <li>robots.txt at /robots.txt</li>
          <li>SEO-friendly URLs (slugs)</li>
          <li>Per-item meta title & description</li>
          <li>Open Graph ready via Next.js Metadata API</li>
        </ul>
      </div>
    </div>
  )
}
