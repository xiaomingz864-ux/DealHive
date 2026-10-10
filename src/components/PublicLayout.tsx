import { Header } from './Header'
import { Footer } from './Footer'
import { getSiteSettings, getActiveCategories } from '@/lib/data'

export async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  )
}
