import { PublicLayout } from '@/components/PublicLayout'
import { getArticleBySlug } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || undefined,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {article.published_at && (
          <time className="text-sm text-slate-400">
            {formatDate(article.published_at)}
          </time>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-4 text-lg text-slate-600">{article.excerpt}</p>
        )}
        {article.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.featured_image}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: article.content || '' }}
        />
      </article>
    </PublicLayout>
  )
}
