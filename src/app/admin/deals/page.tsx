import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils'
import { DeleteButton } from '@/components/admin/DeleteButton'

export default async function AdminDealsPage() {
  const supabase = await createClient()
  const { data: deals } = await supabase
    .from('deals')
    .select('*, product:products(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Deals</h1>
        <Link
          href="/admin/deals/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          + New Deal
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(deals || []).map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {deal.title || (deal.product as { name?: string })?.name || '—'}
                  </div>
                  {deal.is_featured && (
                    <span className="text-xs text-amber-600">Featured</span>
                  )}
                </td>
                <td className="px-4 py-3">{formatPrice(deal.deal_price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      deal.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700'
                        : deal.status === 'expired'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {deal.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {deal.expires_at ? formatDate(deal.expires_at) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/deals/${deal.id}`}
                      className="text-orange-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton table="deals" id={deal.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!deals || deals.length === 0) && (
          <p className="p-8 text-center text-slate-500">No deals yet.</p>
        )}
      </div>
    </div>
  )
}
