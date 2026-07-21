import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Public client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — only ever imported by API routes (server-side), so
// eager creation here is safe; it never gets bundled into client code
// because none of your 'use client' files import supabaseAdmin.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)