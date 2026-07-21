import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

let _adminClient: SupabaseClient | null = null

function getAdminClient(): SupabaseClient {
  if (!_adminClient) {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    _adminClient = createClient(supabaseUrl, supabaseServiceKey)
  }
  return _adminClient
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient()
    return (client as any)[prop]
  }
})