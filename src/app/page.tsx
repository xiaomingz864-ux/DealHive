import { PublicLayout } from '@/components/PublicLayout'
import { DealCard } from '@/components/DealCard'
import {
  getPublishedDeals,
  getSiteSettings,
  getActiveCategories,
  getPublishedArticles,
} from '@/lib/data'
import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  Shield,
  Tag,
  Clock,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
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
  const siteName = settings?.site_name || 'DealHive'

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur">
              <Zap className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
              Fresh deals updated daily
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {settings?.site_tagline || (
                <>
                  Best Amazon{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Deals & Coupons
                  </span>
                </>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Hand-picked discounts, exclusive coupon codes, and limited-time
              offers — so you never overpay on Amazon again.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/deals"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 hover:shadow-orange-500/30"
              >
                Browse All Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Shop by Category
              </Link>
            </div>

            {/* Trust bar */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-500" />
                Verified deals
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-orange-500" />
                Real coupon codes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
                Updated daily
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                Best price tracked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-slate-500">
              Three simple steps to start saving
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Search,
                step: '01',
                title: 'Browse deals',
                desc: 'Explore hand-picked Amazon discounts and active coupon codes, filtered by category.',
              },
              {
                icon: Tag,
                step: '02',
                title: 'Grab the code',
                desc: 'Copy any coupon code shown on the deal card, then click through to Amazon.',
              },
              {
                icon: Sparkles,
                step: '03',
                title: 'Save at checkout',
                desc: 'Apply the code on Amazon and enjoy the lower price. Simple as that.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition hover:border-orange-200 hover:bg-orange-50/30"
              >
                <span className="absolute right-5 top-5 text-3xl font-black text-slate-100">
                  {item.step}
                </span>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured deals */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                Top picks
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Featured Deals
              </h2>
            </div>
            <Link
              href="/deals?featured=1"
              className="hidden items-center gap-1 text-sm font-medium text-orange-600 hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((deal) => (
              <DealCard key={deal.id} deal={deal} affiliateTag={tag} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                Shop smart
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="hidden items-center gap-1 text-sm font-medium text-orange-600 hover:underline sm:inline-flex"
            >
              All categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 text-lg font-bold text-orange-600 transition group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white">
                    {cat.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900 group-hover:text-orange-600">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty', 'Sports', 'Toys', 'Books', 'Grocery'].map(
                (name) => (
                  <div
                    key={name}
                    className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-400">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-400">{name}</h3>
                      <p className="text-xs text-slate-300">Coming soon</p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Latest deals */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
              Just added
            </p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Latest Deals
            </h2>
          </div>
          <Link
            href="/deals"
            className="hidden items-center gap-1 text-sm font-medium text-orange-600 hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Deals are on the way
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              We&apos;re curating the best Amazon discounts and coupon codes.
              Check back soon — or explore categories while you wait.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/deals"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Browse Deals Page
              </Link>
              <Link
                href="/categories"
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((deal) => (
              <DealCard key={deal.id} deal={deal} affiliateTag={tag} />
            ))}
          </div>
        )}
      </section>

      {/* Why trust us */}
      <section className="border-t border-slate-100 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
                Why {siteName}
              </p>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Built for smart shoppers
              </h2>
              <p className="mt-3 text-slate-400">
                We do the hard work of finding real discounts so you can shop
                with confidence and save money every day.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Real discounts only',
                  desc: 'Every deal is checked for a genuine price drop or active coupon.',
                },
                {
                  title: 'Clear coupon codes',
                  desc: 'Codes are displayed upfront — no hidden steps or redirects.',
                },
                {
                  title: 'Expiration tracking',
                  desc: 'Expired offers are automatically hidden so you never waste time.',
                },
                {
                  title: 'Amazon Associates',
                  desc: 'We may earn a small commission at no extra cost to you.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-700/80 bg-slate-800/50 p-5"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-400" />
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      {articles.length > 0 && (
        <section className="border-t border-slate-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Tips & guides
                </p>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  From the Blog
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm font-medium text-orange-600 hover:underline sm:inline-flex"
              >
                All articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  {article.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                      <Sparkles className="h-8 w-8 text-orange-300" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 group-hover:text-orange-600">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="border-t border-slate-100 bg-gradient-to-r from-orange-500 to-amber-500">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start saving?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-orange-100">
            Browse today&apos;s best Amazon deals and coupon codes — updated
            every day.
          </p>
          <Link
            href="/deals"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-bold text-orange-600 shadow-lg transition hover:bg-orange-50"
          >
            Explore All Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  )
}
