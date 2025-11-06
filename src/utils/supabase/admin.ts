import { createClient } from '@supabase/supabase-js'

// IMPORTANT: This client should ONLY be used on the server, in server actions
// or API routes. It is not safe to use in client-side code.
export const createAdminClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase URL or Service Role Key is not defined in environment variables.');
    }
  
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
};
