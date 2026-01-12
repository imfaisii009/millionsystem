import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the service role key.
 * This client bypasses Row Level Security and should only be used server-side.
 *
 * Use cases:
 * - API routes that need to access data without user authentication
 * - Background jobs and webhooks
 * - Admin operations
 *
 * WARNING: Never expose this client or the service role key to the browser.
 */
export function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Singleton instance for reuse within the same request
 * Note: In serverless environments, this will be recreated per request anyway
 */
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createAdminClient()
  }
  return adminClient
}
