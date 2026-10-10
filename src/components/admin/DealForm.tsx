'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Deal } from '@/lib/types'

interface Props {
  deal?: Deal
  products: { id: string; name: string }[]
}

export function DealForm({ deal, products }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    product_id: deal?.product_id || '',
    title: deal?.title || '',
    deal_price: deal?.deal_price?.toString() || '',
    original_price: deal?.original_price?.toString() || '',
    discount_percent: deal?.discount_percent?.toString() || '',
    coupon_code: deal?.coupon_code || '',
    affiliate_url: deal?.affiliate_url || '',
    starts_at: deal?.starts_at
      ? new Date(deal.starts_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    expires_at: deal?.expires_at
      ? new Date(deal.expires_at).toISOString().slice(0, 16)
      : '',
    is_featured: deal?.is_featured || false,
    is_published: deal?.is_published || false,
    status: deal?.status || 'draft',
    meta_title: deal?.meta_title || '',
    meta_description: deal?.meta_description || '',
  })

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()

    const payload = {
      product_id: form.product_id,
      title: form.title || null,
      deal_price: parseFloat(form.deal_price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      discount_percent: form.discount_percent
        ? parseInt(form.discount_percent, 10)
        : null,
      coupon_code: form.coupon_code || null,
      affiliate_url: form.affiliate_url || null,
      starts_at: new Date(form.starts_at).toISOString(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      is_featured: form.is_featured,
      is_published: form.is_published,
      status: form.status as Deal['status'],
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    }

    let result
    if (deal) {
      result = await supabase.from('deals').update(payload).eq('id', deal.id)
    } else {
      result = await supabase.from('deals').insert(payload)
    }

    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push('/admin/deals')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Product *</label>
        <select required value={form.product_id} onChange={(e) => update('product_id', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm">
          <option value="">Select product…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Custom title (optional)</label>
        <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Overrides product name" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Deal price *</label>
          <input type="number" step="0.01" required value={form.deal_price} onChange={(e) => update('deal_price', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Original price</label>
          <input type="number" step="0.01" value={form.original_price} onChange={(e) => update('original_price', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Discount %</label>
          <input type="number" value={form.discount_percent} onChange={(e) => update('discount_percent', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Coupon code</label>
          <input type="text" value={form.coupon_code} onChange={(e) => update('coupon_code', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Affiliate URL (optional)</label>
          <input type="url" value={form.affiliate_url} onChange={(e) => update('affiliate_url', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Leave blank to auto-build" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Starts at</label>
          <input type="datetime-local" value={form.starts_at} onChange={(e) => update('starts_at', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Expires at</label>
          <input type="datetime-local" value={form.expires_at} onChange={(e) => update('expires_at', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm">
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => update('is_published', e.target.checked)} className="rounded" />
          Published
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="rounded" />
          Featured
        </label>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Meta title</label>
        <input type="text" value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Meta description</label>
        <textarea value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Saving…' : deal ? 'Update Deal' : 'Create Deal'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </form>
  )
}
