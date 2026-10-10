import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: category } = await supabase.from('categories').select('*').eq('id', id).single()
  if (!category) notFound()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  )
}
