import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, formatDate, buildAffiliateUrl } from '@/lib/utils'
import type { DealWithProduct } from '@/lib/types'
import { Tag, Clock, Percent, ExternalLink } from 'lucide-react'

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
    (original
      ? Math.round(((Number(original) - Number(deal.deal_price)) / Number(original)) * 100)
      : null)

  const href = buildAffiliateUrl(
    product.amazon_url,
    affiliateTag,
    deal.affiliate_url
  )

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/80">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={displayTitle}
            fill
            className="object-contain p-5 transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Tag className="h-10 w-10" />
          </div>
        )}

        {discount != null && discount > 0 && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            <Percent className="h-3 w-3" />
            {discount}% OFF
          </span>
        )}

        {deal.is_featured && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-600 hover:underline"
          >
            {product.category.name}
          </Link>
        )}

        <h3 className="mb-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-slate-900">
          {displayTitle}
        </h3>

        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            {formatPrice(deal.deal_price)}
          </span>
          {original != null && Number(original) > Number(deal.deal_price) && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(original)}
            </span>
          )}
        </div>

        {deal.coupon_code && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            <span>
              Code:{' '}
              <span className="font-mono font-bold tracking-wide">
                {deal.coupon_code}
              </span>
            </span>
          </div>
        )}

        {deal.expires_at && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            Expires {formatDate(deal.expires_at)}
          </div>
        )}

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
        >
          Get Deal
          <ExternalLink className="h-3.5 w-3.5 opacity-80" />
        </a>
      </div>
    </article>
  )
}
