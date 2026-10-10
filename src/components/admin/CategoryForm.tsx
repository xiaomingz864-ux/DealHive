'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/types'

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
    sort_order: category?.sort_order?.toString() || '0',
    is_active: category?.is_active ?? true,
    meta_title: category?.meta_title || '',
    meta_description: category?.meta_description || '',
  })

  function update(field: string, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'name' && !category) next.slug = slugify(value as string)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      image_url: form.image_url || null,
      sort_order: parseInt(form.sort_order, 10) || 0,
      is_active: form.is_active,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    }
    const result = category
      ? await supabase.from('categories').update(payload).eq('id', category.id)
      : await supabase.from('categories').insert(payload)
    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push('/admin/categories')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
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
        <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Sort order</label>
          <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <label className="flex items-center gap-2 pt-6 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(e) => update('is_active', e.target.checked)} className="rounded" />
          Active
        </label>
      </div>
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
          {loading ? 'Saving…' : category ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm">Cancel</button>
      </div>
    </form>
  )
}
