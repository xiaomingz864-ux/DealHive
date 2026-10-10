import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single()
  if (!article) notFound()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit Article</h1>
      <ArticleForm article={article} />
    </div>
  )
}
