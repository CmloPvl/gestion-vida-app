import { createClient } from '@supabase/supabase-js'

// Estas variables leen directamente de tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Si alguna falta, te avisará en la consola del terminal
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Advertencia: Las credenciales de Supabase no están configuradas correctamente en .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)