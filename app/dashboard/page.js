"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  const [business_name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔥 SLUG AUTOMÁTICO (ESTO ES LO IMPORTANTE)
  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const slug = slugify(business_name)

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        business_name,
        description,
        whatsapp,
        slug
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
      <h1>Dashboard</h1>

      <form onSubmit={handleSubmit}>
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