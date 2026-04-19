'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: email
    })

    if (error) {
      alert('Error')
    } else {
      alert('Revisa tu email para entrar')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Entrar</h1>

      <input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>
        {loading ? 'Enviando...' : 'Entrar'}
      </button>
    </div>
  )
}