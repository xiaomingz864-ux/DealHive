'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Page } from '@/lib/types'

export function PageForm({ page }: { page: Page }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: page.title,
    content: page.content || '',
    meta_title: page.meta_title || '',
    meta_description: page.meta_description || '',
    is_published: page.is_published,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase
      .from('pages')
      .update({
        title: form.title,
        content: form.content,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        is_published: form.is_published,
      })
      .eq('id', page.id)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push('/admin/pages')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Content (HTML)</label>
        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={14} className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Meta title</label>
        <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Meta description</label>
        <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
        Published
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
          {loading ? 'Saving…' : 'Update Page'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm">Cancel</button>
      </div>
    </form>
  )
}
