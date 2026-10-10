import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatDate, buildAffiliateUrl } from '@/lib/utils'
import type { DealWithProduct } from '@/lib/types'
import { Tag, Clock, Percent } from 'lucide-react'

interface DealCardProps {
  deal: DealWithProduct
  affiliateTag: string
}

export function DealCard({ deal, affiliateTag }: DealCardProps) {
  const product = deal.product
  if (!product) return null

  const displayTitle = deal.title || product.name
  const original = deal.original_price ?? product.original_price
  const discount =
    deal.discount_percent ??
    (original ? Math.round(((original - deal.deal_price) / original) * 100) : null)

  const href = buildAffiliateUrl(product.amazon_url, affiliateTag, deal.affiliate_url)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={displayTitle}
            fill
            className="object-contain p-4 transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            No image
          </div>
        )}
        {discount && discount > 0 && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            <Percent className="h-3 w-3" />
            {discount}% OFF
          </span>
        )}
        {deal.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="mb-1 text-xs font-medium uppercase tracking-wide text-orange-600 hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {displayTitle}
        </h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(deal.deal_price)}
          </span>
          {original && original > deal.deal_price && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(original)}
            </span>
          )}
        </div>

        {deal.coupon_code && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
            <Tag className="h-3.5 w-3.5" />
            Code: <span className="font-mono font-bold">{deal.coupon_code}</span>
          </div>
        )}

        {deal.expires_at && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5" />
            Expires {formatDate(deal.expires_at)}
          </div>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-auto flex h-10 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Get Deal
        </a>
      </div>
    </article>
  )
}
