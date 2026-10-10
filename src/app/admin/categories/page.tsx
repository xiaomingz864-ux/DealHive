import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
        <Link href="/admin/categories/new" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          + New Category
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(categories || []).map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">{c.sort_order}</td>
                <td className="px-4 py-3">{c.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/categories/${c.id}`} className="text-orange-600 hover:underline">Edit</Link>
                    <DeleteButton table="categories" id={c.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!categories || categories.length === 0) && (
          <p className="p-8 text-center text-slate-500">No categories yet.</p>
        )}
      </div>
    </div>
  )
}
