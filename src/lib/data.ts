import { createClient } from '@/lib/supabase/server'
import type { DealWithProduct, Category, Article, Page, SiteSettings, Product } from '@/lib/types'

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*').limit(1).single()
  return data
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function getPublishedDeals(options?: {
  featured?: boolean
  categorySlug?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<DealWithProduct[]> {
  const supabase = await createClient()
  let query = supabase
    .from('deals')
    .select(`
      *,
      product:products (
        *,
        category:categories (*)
      )
    `)
    .eq('is_published', true)
    .eq('status', 'published')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .lte('starts_at', new Date().toISOString())
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1)
  }

  const { data } = await query
  let deals = (data || []) as DealWithProduct[]

  if (options?.categorySlug) {
    deals = deals.filter(
      (d) => d.product?.category?.slug === options.categorySlug
    )
  }

  if (options?.search) {
    const q = options.search.toLowerCase()
    deals = deals.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.product?.name?.toLowerCase().includes(q) ||
        d.coupon_code?.toLowerCase().includes(q)
    )
  }

  return deals
}

export async function getDealById(id: string): Promise<DealWithProduct | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('deals')
    .select(`
      *,
      product:products (
        *,
        category:categories (*)
      )
    `)
    .eq('id', id)
    .single()
  return data as DealWithProduct | null
}

export async function getPublishedArticles(limit = 10): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('name')
  return data || []
}
