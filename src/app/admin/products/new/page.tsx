import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">New Product</h1>
      <ProductForm categories={categories || []} />
    </div>
  )
}
