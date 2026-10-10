import { PublicLayout } from '@/components/PublicLayout'
import { getPublishedArticles } from '@/lib/data'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Tips, guides and deal roundups from DealHive.',
}

export default async function BlogPage() {
  const articles = await getPublishedArticles(50)

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Blog</h1>
        <p className="mb-8 text-slate-500">Tips, guides and deal roundups</p>

        {articles.length === 0 ? (
          <p className="text-slate-500">No articles yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:shadow-md"
              >
                {article.featured_image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.featured_image}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="p-5">
                  {article.published_at && (
                    <time className="text-xs text-slate-400">
                      {formatDate(article.published_at)}
                    </time>
                  )}
                  <h2 className="mt-1 font-semibold text-slate-900 group-hover:text-orange-600">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
