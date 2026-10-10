import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminPagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase.from('pages').select('*').order('title')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Pages</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(pages || []).map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 font-mono text-slate-500">/{p.slug}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pages/${p.id}`} className="text-orange-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
