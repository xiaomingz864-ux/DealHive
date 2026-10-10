import { PublicLayout } from '@/components/PublicLayout'
import { DealCard } from '@/components/DealCard'
import { getPublishedDeals, getSiteSettings, getActiveCategories } from '@/lib/data'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Deals',
  description: 'Browse all active Amazon deals and coupon codes.',
}

interface Props {
  searchParams: Promise<{ q?: string; category?: string; featured?: string }>
}

export default async function DealsPage({ searchParams }: Props) {
  const params = await searchParams
  const [deals, settings, categories] = await Promise.all([
    getPublishedDeals({
      search: params.q,
      categorySlug: params.category,
      featured: params.featured === '1',
      limit: 48,
    }),
    getSiteSettings(),
    getActiveCategories(),
  ])

  const tag = settings?.amazon_affiliate_tag || 'yourtag-20'

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">All Deals</h1>
          <p className="mt-1 text-slate-500">
            {deals.length} active deal{deals.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form className="flex flex-1 gap-2" action="/deals" method="get">
            <input
              type="search"
              name="q"
              defaultValue={params.q || ''}
              placeholder="Search deals..."
              className="h-10 w-full max-w-xs rounded-lg border border-slate-200 px-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/deals"
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                !params.category && !params.featured
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </Link>
            <Link
              href="/deals?featured=1"
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                params.featured === '1'
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Featured
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/deals?category=${cat.slug}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  params.category === cat.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {deals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center">
            <p className="text-slate-500">No deals match your filters.</p>
            <Link
              href="/deals"
              className="mt-3 inline-block text-sm font-medium text-orange-600 hover:underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} affiliateTag={tag} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
