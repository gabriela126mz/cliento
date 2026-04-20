"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  const [business_name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  const [loading, setLoading] = useState(false)

  // 🔥 cargar usuario + profile
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      setUser(user)

      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(data)
    }

    load()
  }, [])

  const slugify = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")

  // 🔥 guardar negocio
  const save = async (e) => {
    e.preventDefault()

    if (!user || loading) return

    setLoading(true)

    const slug = slugify(business_name)

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      business_name,
      description,
      whatsapp,
      slug
    })

    if (error) {
      console.log(error)
      setLoading(false)
      return
    }

    // 🔥 refrescar datos
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    setProfile(data)

    setLoading(false)
    alert("Guardado ✔")
  }

  if (!user) return <p>Cargando usuario...</p>

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>Dashboard</h1>

      {/* 🔥 RESUMEN */}
      {profile?.business_name && (
        <div style={{ padding: 10, border: "1px solid #ccc", marginBottom: 20 }}>
          <h2>📊 Tu negocio</h2>

          <p><strong>Nombre:</strong> {profile.business_name}</p>
          <p><strong>Descripción:</strong> {profile.description}</p>
          <p><strong>WhatsApp:</strong> {profile.whatsapp}</p>
          <p><strong>Slug:</strong> {profile.slug}</p>

          <p>
            🔗 URL pública:{" "}
            <a href={`/${profile.slug}`}>
              /{profile.slug}
            </a>
          </p>
        </div>
      )}

      {/* 🔥 FORM */}
      <form onSubmit={save}>
        <input
          placeholder="Nombre negocio"
          value={business_name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}