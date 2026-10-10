'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function DeleteButton({
  table,
  id,
  label = 'Delete',
}: {
  table: string
  id: string
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from(table).delete().eq('id', id)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {loading ? '…' : label}
    </button>
  )
}
