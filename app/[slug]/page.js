"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { QRCodeCanvas } from "qrcode.react"

export default function Page() {
  const { slug } = useParams()
  const router = useRouter()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .eq("user_id", userData.user.id)
        .single()

      setProfile(data)
    }

    if (slug) load()
  }, [slug])

  if (!profile) return <p>Cargando...</p>

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>📊 Tu negocio</h1>

      <p><b>Nombre:</b> {profile.business_name}</p>
      <p><b>Descripción:</b> {profile.description}</p>
      <p><b>WhatsApp:</b> {profile.whatsapp}</p>

      <h3>📱 QR</h3>

      <QRCodeCanvas value={`https://cliento-blue.vercel.app/${profile.slug}`} />

      <div style={{ marginTop: 20 }}>
        <Link href={`/${profile.slug}/edit`}>
          <button>✏️ Editar</button>
        </Link>
      </div>
    </div>
  )
}