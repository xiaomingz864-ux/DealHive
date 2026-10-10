import { PublicLayout } from '@/components/PublicLayout'
import { DealCard } from '@/components/DealCard'
import { getCategoryBySlug, getPublishedDeals, getSiteSettings } from '@/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.meta_title || category.name,
    description: category.meta_description || category.description || undefined,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, deals, settings] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedDeals({ categorySlug: slug, limit: 48 }),
    getSiteSettings(),
  ])

  if (!category) notFound()

  const tag = settings?.amazon_affiliate_tag || 'yourtag-20'

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">{category.name}</h1>
        {category.description && (
          <p className="mb-8 text-slate-500">{category.description}</p>
        )}

        {deals.length === 0 ? (
          <p className="py-12 text-center text-slate-500">
            No active deals in this category.
          </p>
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
