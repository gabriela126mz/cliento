'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function EditPage() {
  const [business_name, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setBusinessName(data.business_name || '')
        setDescription(data.description || '')
        setWhatsapp(data.whatsapp || '')
      }
    }

    load()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        business_name,
        description,
        whatsapp,
        email: user.email
      })

    if (error) {
      setMessage('Error ❌')
    } else {
      setMessage('Guardado ✅')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Editar perfil</h1>

      <form onSubmit={handleUpdate}>
        <input
          placeholder="Nombre negocio"
          value={business_name}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button type="submit">Guardar</button>
      </form>

      <p>{message}</p>
    </main>
  )
}