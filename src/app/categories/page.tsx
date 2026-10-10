import { PublicLayout } from '@/components/PublicLayout'
import { getActiveCategories } from '@/lib/data'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse Amazon deals by category.',
}

export default async function CategoriesPage() {
  const categories = await getActiveCategories()

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Categories</h1>
        <p className="mb-8 text-slate-500">Shop deals by category</p>

        {categories.length === 0 ? (
          <p className="text-slate-500">No categories yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group rounded-2xl border border-slate-100 bg-white p-6 transition hover:border-orange-200 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {cat.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
