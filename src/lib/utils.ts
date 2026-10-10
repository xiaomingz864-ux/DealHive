import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | null | undefined): string {
  if (price == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function calculateDiscount(original: number | null, deal: number): number | null {
  if (!original || original <= 0) return null
  return Math.round(((original - deal) / original) * 100)
}

export function buildAffiliateUrl(amazonUrl: string, tag: string, existingAffiliate?: string | null): string {
  if (existingAffiliate) return existingAffiliate
  try {
    const url = new URL(amazonUrl)
    url.searchParams.set('tag', tag)
    return url.toString()
  } catch {
    return amazonUrl
  }
}

export function isDealActive(deal: { expires_at: string | null; starts_at: string; is_published: boolean; status: string }): boolean {
  if (!deal.is_published || deal.status !== 'published') return false
  const now = new Date()
  if (new Date(deal.starts_at) > now) return false
  if (deal.expires_at && new Date(deal.expires_at) < now) return false
  return true
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: string | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | null): string {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}
