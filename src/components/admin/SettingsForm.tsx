'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { SiteSettings } from '@/lib/types'

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    site_name: settings.site_name,
    site_tagline: settings.site_tagline || '',
    logo_url: settings.logo_url || '',
    contact_email: settings.contact_email || '',
    contact_phone: settings.contact_phone || '',
    amazon_affiliate_tag: settings.amazon_affiliate_tag,
    meta_title: settings.meta_title || '',
    meta_description: settings.meta_description || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    const supabase = createClient()
    const { error } = await supabase
      .from('site_settings')
      .update({
        site_name: form.site_name,
        site_tagline: form.site_tagline || null,
        logo_url: form.logo_url || null,
        contact_email: form.contact_email || null,
        contact_phone: form.contact_phone || null,
        amazon_affiliate_tag: form.amazon_affiliate_tag,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      })
      .eq('id', settings.id)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Site name *</label>
        <input required value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Tagline</label>
        <input value={form.site_tagline} onChange={(e) => setForm({ ...form, site_tagline: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Logo URL</label>
        <input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Contact email</label>
          <input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Contact phone</label>
          <input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Amazon affiliate tag *</label>
        <input required value={form.amazon_affiliate_tag} onChange={(e) => setForm({ ...form, amazon_affiliate_tag: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono" placeholder="yourtag-20" />
        <p className="mt-1 text-xs text-slate-500">Appended to all Amazon links (e.g. yourtag-20)</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Default meta title</label>
        <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Default meta description</label>
        <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-600">Settings saved.</p>}
      <button type="submit" disabled={loading} className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50">
        {loading ? 'Saving…' : 'Save Settings'}
      </button>
    </form>
  )
}
