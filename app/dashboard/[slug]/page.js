"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function Page() {
  const router = useRouter(); // ✅ AQUÍ DENTRO
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      setProfile(data);
    };

    load();
  }, [slug]);

  if (!profile) return <p>Cargando...</p>;

  const publicUrl = `http://localhost:3000/negocio/${profile.slug}`;

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>📊 Tu negocio</h1>

      <p><b>Nombre:</b> {profile.business_name}</p>
      <p><b>Descripción:</b> {profile.description}</p>
      <p><b>WhatsApp:</b> {profile.whatsapp}</p>
      <p><b>Slug:</b> {profile.slug}</p>

      {/* 🔙 BOTÓN VOLVER */}
      <button
        onClick={() => router.push("/panel")}
        style={{
          padding: "10px 14px",
          background: "#333",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        ← Volver al panel
      </button>

      {/* QR */}
      <div style={{ marginTop: 20 }}>
        <h3>📱 QR</h3>
        <QRCodeCanvas value={publicUrl} size={160} />
      </div>

      {/* EDITAR */}
      <div style={{ marginTop: 20 }}>
        <Link href={`/dashboard/${profile.slug}/edit`}>
          <button>✏️ Editar negocio</button>
        </Link>
      </div>

      {/* LINK */}
      <p style={{ marginTop: 20 }}>🔗 {publicUrl}</p>
    </div>
  );
}