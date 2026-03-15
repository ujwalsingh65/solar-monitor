// Supabase client for database operations only (auth handled by Clerk)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Base client for unauthenticated / public requests
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionFromUrl: false,
  },
});

/**
 * Creates an authenticated Supabase client using a Clerk JWT token.
 *
 * Usage inside components/hooks:
 *   const { getToken } = useAuth();
 *   const client = await getSupabaseClient(getToken);
 *   const { data } = await client.from('my_table').select('*');
 *
 * To enable this, add a "Supabase" JWT template in your Clerk dashboard:
 *   Clerk Dashboard → JWT Templates → New → Supabase
 *   Set the "sub" claim to {{ user.id }}
 */
export const getSupabaseClient = async (
  getToken: (options?: { template?: string }) => Promise<string | null>
) => {
  const token = await getToken({ template: 'supabase' });

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionFromUrl: false,
    },
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  });
};
