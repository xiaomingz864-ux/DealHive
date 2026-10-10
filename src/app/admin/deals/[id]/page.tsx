import { createClient } from '@/lib/supabase/server'
import { DealForm } from '@/components/admin/DealForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDealPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: deal }, { data: products }] = await Promise.all([
    supabase.from('deals').select('*').eq('id', id).single(),
    supabase.from('products').select('id, name').eq('is_active', true).order('name'),
  ])

  if (!deal) notFound()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Deal</h1>
      <DealForm deal={deal} products={products || []} />
    </div>
  )
}
