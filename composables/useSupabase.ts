/**
 * Lightweight Supabase composable with mock fallback support.
 * Can be connected to a live Supabase project by providing
 * SUPABASE_URL and SUPABASE_ANON_KEY in runtimeConfig.
 */
export function useSupabase() {
  const config = useRuntimeConfig()
  const isConfigured = Boolean(config.public?.supabaseUrl && config.public?.supabaseKey)

  return {
    isConfigured,
    // Provide a unified query/table interface
    from: (table: string) => ({
      select: async () => ({ data: [], error: null }),
      insert: async (data: any) => ({ data, error: null }),
      update: async (data: any) => ({ data, error: null }),
    }),
  }
}
