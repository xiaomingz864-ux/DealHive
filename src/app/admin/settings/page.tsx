import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*').limit(1).single()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Site Settings</h1>
      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="text-slate-500">No settings found. Run the schema SQL first.</p>
      )}
    </div>
  )
}
