"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EditPage() {
  const { slug } = useParams()
  const router = useRouter()

  const [user, setUser] = useState(null)

  const [form, setForm] = useState({
    business_name: "",
    description: "",
    whatsapp: ""
  })

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push("/login")
        return
      }

      setUser(userData.user)

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("user_id", userData.user.id)
        .single()

      if (data) {
        setForm({
          business_name: data.business_name,
          description: data.description,
          whatsapp: data.whatsapp
        })
      }
    }

    if (slug) init()
  }, [slug])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const save = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: form.business_name,
        description: form.description,
        whatsapp: form.whatsapp
      })
      .eq("slug", slug)
      .eq("user_id", user.id)

    if (error) {
      alert(error.message)
      return
    }

    router.replace(`/${slug}`)
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>✏️ Editar negocio</h1>

      <form onSubmit={save}>
        <input name="business_name" value={form.business_name} onChange={handleChange} />
        <input name="description" value={form.description} onChange={handleChange} />
        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} />

        <button>Guardar</button>
      </form>
    </div>
  )
}