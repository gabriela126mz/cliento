"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState(null)

  const [form, setForm] = useState({
    business_name: "",
    description: "",
    whatsapp: ""
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
    }

    checkUser()
  }, [])

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const slug = slugify(form.business_name)

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        business_name: form.business_name,
        description: form.description,
        whatsapp: form.whatsapp,
        slug,
        user_id: user.id
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push(`/${data.slug}`)
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      {user && (
        <div style={{ marginBottom: 15 }}>
          <h3>👋 Bienvenido de nuevo</h3>
          <p>Gestiona tus clientes aquí</p>
        </div>
      )}

      <h1>Dashboard</h1>

      <form onSubmit={submit}>
        <input name="business_name" placeholder="Nombre" onChange={handleChange} />
        <input name="description" placeholder="Descripción" onChange={handleChange} />
        <input name="whatsapp" placeholder="WhatsApp" onChange={handleChange} />

        <button disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}