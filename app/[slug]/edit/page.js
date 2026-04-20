"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Edit() {
  const { slug } = useParams()
  const router = useRouter()

  const [form, setForm] = useState({
    business_name: "",
    description: "",
    whatsapp: ""
  })

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .single()

      if (data) {
        setForm({
          business_name: data.business_name || "",
          description: data.description || "",
          whatsapp: data.whatsapp || ""
        })
      }
    }

    if (slug) load()
  }, [slug])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const save = async (e) => {
    e.preventDefault()

    await supabase
      .from("profiles")
      .update(form)
      .eq("slug", slug)

    router.push(`/${slug}`)
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>✏️ Editar negocio</h1>

      <form onSubmit={save}>
        <input
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
        />

        <input
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
        />

        <button>Guardar</button>
      </form>
    </div>
  )
}