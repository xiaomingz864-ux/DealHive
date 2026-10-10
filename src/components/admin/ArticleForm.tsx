'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Article } from '@/lib/types'

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    featured_image: article?.featured_image || '',
    is_published: article?.is_published || false,
    published_at: article?.published_at
      ? new Date(article.published_at).toISOString().slice(0, 16)
      : '',
    meta_title: article?.meta_title || '',
    meta_description: article?.meta_description || '',
  })

  function update(field: string, value: string | boolean) {
    setForm((f) => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !article) next.slug = slugify(value as string)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      featured_image: form.featured_image || null,
      is_published: form.is_published,
      published_at: form.is_published
        ? form.published_at
          ? new Date(form.published_at).toISOString()
          : new Date().toISOString()
        : null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    }
    const result = article
      ? await supabase.from('articles').update(payload).eq('id', article.id)
      : await supabase.from('articles').insert(payload)
    setLoading(false)
    if (result.error) {
      setError(result.error.message)
      return
    }
    router.push('/admin/articles')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Title *</label>
        <input required value={form.title} onChange={(e) => update('title', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Slug *</label>
        <input required value={form.slug} onChange={(e) => update('slug', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Excerpt</label>
        <textarea value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Content (HTML)</label>
        <textarea value={form.content} onChange={(e) => update('content', e.target.value)} rows={12} className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Featured image URL</label>
        <input type="url" value={form.featured_image} onChange={(e) => update('featured_image', e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_published} onChange={(e) => update('is_published', e.target.checked)} className="rounded" />
          Published
        </label>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Publish date</label>
          <input type="datetime-local" value={form.published_at} onChange={(e) => update('published_at', e.target.value)} className="h-9 rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
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
          {loading ? 'Saving…' : article ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm">Cancel</button>
      </div>
    </form>
  )
}
