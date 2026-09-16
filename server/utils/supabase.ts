import { createClient } from '@supabase/supabase-js'

export function useServerSupabase() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.supabaseServiceRoleKey || config.public.supabaseKey
  return createClient(url, key)
}
