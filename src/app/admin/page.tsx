import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: dealsCount },
    { count: publishedDeals },
    { count: productsCount },
    { count: categoriesCount },
    { count: articlesCount },
    { count: publishedArticles },
  ] = await Promise.all([
    supabase.from('deals').select('*', { count: 'exact', head: true }),
    supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .eq('status', 'published'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
  ])

  const stats = [
    { label: 'Total Deals', value: dealsCount ?? 0, href: '/admin/deals' },
    { label: 'Published Deals', value: publishedDeals ?? 0, href: '/admin/deals' },
    { label: 'Products', value: productsCount ?? 0, href: '/admin/products' },
    { label: 'Categories', value: categoriesCount ?? 0, href: '/admin/categories' },
    { label: 'Articles', value: articlesCount ?? 0, href: '/admin/articles' },
    { label: 'Published Articles', value: publishedArticles ?? 0, href: '/admin/articles' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:shadow-sm"
          >
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-slate-900">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/deals/new"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            + New Deal
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + New Product
          </Link>
          <Link
            href="/admin/articles/new"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + New Article
          </Link>
        </div>
      </div>
    </div>
  )
}
