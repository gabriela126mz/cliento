'use client'
console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
    }

    getUser()
  }, [])

  if (!user) return <p>Cargando...</p>

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Hola {user.email}</p>

      <a href="/dashboard/edit">Ir a editar perfil →</a>
    </main>
  )
}