import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Frontend bundles are public by design, so any secret key here would leak.
if (import.meta.env.VITE_SUPABASE_SECRET_KEY) {
  throw new Error('Do not expose VITE_SUPABASE_SECRET_KEY in frontend env. Use publishable key only.');
}

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey)
    : null;
