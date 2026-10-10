import { createClient } from '@/lib/supabase/server'
import { DealForm } from '@/components/admin/DealForm'

export default async function NewDealPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Deal</h1>
      <DealForm products={products || []} />
    </div>
  )
}
