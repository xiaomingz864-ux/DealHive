'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props {
  product?: Product
  categories: { id: string; name: string }[]
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
    amazon_url: product?.amazon_url || '',
    asin: product?.asin || '',
    category_id: product?.category_id || '',
    original_price: product?.original_price?.toString() || '',
    is_active: product?.is_active ?? true,
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
  })

  function update(field: string, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'name' && !product) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      amazon_url: form.amazon_url,
      asin: form.asin || null,
      category_id: form.category_id || null,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      is_active: form.is_active,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    }
    const result = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)
    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Name *</label>
        <input required value={form.name} onChange={(e) => update('name', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Slug *</label>
        <input required value={form.slug} onChange={(e) => update('slug', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Image URL</label>
        <input type="url" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Amazon URL *</label>
        <input type="url" required value={form.amazon_url} onChange={(e) => update('amazon_url', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">ASIN</label>
          <input value={form.asin} onChange={(e) => update('asin', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select value={form.category_id} onChange={(e) => update('category_id', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Original price</label>
          <input type="number" step="0.01" value={form.original_price} onChange={(e) => update('original_price', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded" />
        Active
      </label>
      <div>
        <label className="mb-1 block text-sm font-medium">Meta title</label>
        <input value={form.meta_title} onChange={(e) => update('meta_title', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Meta description</label>
        <textarea value={form.meta_description} onChange={(e) => update('meta_description', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Saving…' : product ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm">Cancel</button>
      </div>
    </form>
  )
}
