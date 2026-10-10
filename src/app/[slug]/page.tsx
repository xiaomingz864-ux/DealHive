import { PublicLayout } from '@/components/PublicLayout'
import { getPageBySlug } from '@/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const ALLOWED = ['about', 'contact', 'privacy-policy', 'affiliate-disclosure', 'terms']

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!ALLOWED.includes(slug)) return {}
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || undefined,
  }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  if (!ALLOWED.includes(slug)) notFound()

  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: page.content || '' }}
        />
      </div>
    </PublicLayout>
  )
}
