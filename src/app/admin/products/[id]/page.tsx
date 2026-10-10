import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name').order('name'),
  ])
  if (!product) notFound()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Product</h1>
      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
