import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// createClient throws on a missing url/key, which would prevent the whole app
// from mounting — export null instead so only order submission degrades.
export const supabase = (url && anonKey) ? createClient(url, anonKey) : null
