import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-14 items-center border-b border-slate-100 px-4">
          <Link href="/admin" className="font-bold text-slate-900">
            DealHive Admin
          </Link>
        </div>
        <AdminNav />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <Link href="/admin" className="font-bold text-slate-900 lg:hidden">
            DealHive Admin
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-slate-500 hover:text-orange-600"
            >
              View site ↗
            </Link>
            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="text-sm text-slate-500 hover:text-red-600"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
