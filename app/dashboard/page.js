"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  const [form, setForm] = useState({
    business_name: "",
    description: "",
    whatsapp: ""
  })

  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const slug = slugify(form.business_name)

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        business_name: form.business_name,
        description: form.description,
        whatsapp: form.whatsapp,
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
          name="business_name"
          placeholder="Nombre"
          value={form.business_name}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  )
}