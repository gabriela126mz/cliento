"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function Page() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);

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
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      {/* HEADER BONITO */}
      <h1>🌿 {profile.business_name}</h1>

      <p style={{ color: "#666" }}>{profile.description}</p>

      {/* CONTACTO */}
      <div style={{ marginTop: 10 }}>
        <p>📱 WhatsApp: {profile.whatsapp}</p>
      </div>

      {/* BOTÓN CONTACTO (IMPORTANTE PARA CONVERSIÓN) */}
      <a
        href={`https://wa.me/${profile.whatsapp}`}
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: 10,
          padding: "10px 14px",
          background: "green",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        💬 Contactar por WhatsApp
      </a>

      {/* QR */}
      <div style={{ marginTop: 30 }}>
        <h3>📱 Comparte este QR</h3>
        <QRCodeCanvas value={publicUrl} size={160} />
      </div>

      {/* LINK */}
      <p style={{ marginTop: 20, color: "#666" }}>{publicUrl}</p>

    
    </div>
  );
}