import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function useSupabase(): SupabaseClient {
  if (_client) return _client

  const config = useRuntimeConfig()
  const url = (config.public.supabaseUrl as string) || 'https://unfevsmviabqvlffwzsc.supabase.co'
  const key = (config.public.supabaseKey as string) || ''

  if (!url || !key) {
    console.warn('[Supabase] Missing credentials in runtimeConfig!')
  }

  _client = createClient(url, key)
  return _client
}
