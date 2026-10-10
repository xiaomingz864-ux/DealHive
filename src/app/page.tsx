import { PublicLayout } from '@/components/PublicLayout'
import { DealCard } from '@/components/DealCard'
import { getPublishedDeals, getSiteSettings, getActiveCategories, getPublishedArticles } from '@/lib/data'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: settings?.meta_title || undefined,
    description: settings?.meta_description || undefined,
  }
}

export default async function HomePage() {
  const [featured, latest, settings, categories, articles] = await Promise.all([
    getPublishedDeals({ featured: true, limit: 4 }),
    getPublishedDeals({ limit: 8 }),
    getSiteSettings(),
    getActiveCategories(),
    getPublishedArticles(3),
  ])

  const tag = settings?.amazon_affiliate_tag || 'yourtag-20'

  return (
    <PublicLayout>
      <section className="border-b border-slate-100 bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              <Zap className="h-3.5 w-3.5" />
              Updated daily
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {settings?.site_tagline || 'Best Amazon Deals & Coupons'}
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Save money every day with hand-picked deals, exclusive coupon codes,
              and limited-time offers from Amazon.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/deals"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Browse All Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Shop by Category
              </Link>
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Featured Deals</h2>
            <Link href="/deals?featured=1" className="text-sm font-medium text-orange-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((deal) => (
              <DealCard key={deal.id} deal={deal} affiliateTag={tag} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Latest Deals</h2>
          <Link href="/deals" className="text-sm font-medium text-orange-600 hover:underline">
            View all →
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="py-12 text-center text-slate-500">
            No active deals right now. Check back soon!
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((deal) => (
              <DealCard key={deal.id} deal={deal} affiliateTag={tag} />
            ))}
          </div>
        )}
      </section>

      {articles.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">From the Blog</h2>
              <Link href="/blog" className="text-sm font-medium text-orange-600 hover:underline">
                All articles →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-orange-600">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {article.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  )
}
