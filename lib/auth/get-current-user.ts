import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null // Supabase is not configured
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function getCurrentUserId(): Promise<string> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session?.user) {
    return session.user.id
  }

  // Pour les utilisateurs non connectés, on utilise l'identifiant de session du cookie
  const sessionId = (await cookieStore).get('session_id')?.value
  if (!sessionId) {
    // Si pas de session, on retourne un identifiant temporaire
    return 'anonymous'
  }
  return `anon_${sessionId}`
}
