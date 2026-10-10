export interface SiteSettings {
  id: string
  site_name: string
  site_tagline: string | null
  logo_url: string | null
  contact_email: string | null
  contact_phone: string | null
  amazon_affiliate_tag: string
  meta_title: string | null
  meta_description: string | null
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  amazon_url: string
  asin: string | null
  category_id: string | null
  original_price: number | null
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: Category | null
}

export interface Deal {
  id: string
  product_id: string
  title: string | null
  deal_price: number
  original_price: number | null
  discount_percent: number | null
  coupon_code: string | null
  affiliate_url: string | null
  starts_at: string
  expires_at: string | null
  is_featured: boolean
  is_published: boolean
  status: 'draft' | 'scheduled' | 'published' | 'expired'
  click_count: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  product?: Product | null
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  author_id: string | null
  is_published: boolean
  published_at: string | null
  scheduled_at: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string | null
  meta_title: string | null
  meta_description: string | null
  is_published: boolean
  updated_at: string
}

export interface DealWithProduct extends Deal {
  product: Product
}
