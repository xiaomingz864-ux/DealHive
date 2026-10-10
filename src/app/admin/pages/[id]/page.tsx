import { createClient } from '@/lib/supabase/server'
import { PageForm } from '@/components/admin/PageForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()
  if (!page) notFound()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit: {page.title}</h1>
      <PageForm page={page} />
    </div>
  )
}
