"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function Page() {
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

      {/* QR */}
      <div style={{ marginTop: 20 }}>
        <h3>📱 QR</h3>
        <QRCodeCanvas value={publicUrl} size={160} />
      </div>

      {/* BOTÓN EDITAR */}
      <div style={{ marginTop: 20 }}>
        <Link href={`/dashboard/${profile.slug}/edit`}>
          <button>✏️ Editar negocio</button>
        </Link>
      </div>

      {/* LINK PÚBLICO */}
      <p style={{ marginTop: 20 }}>
        🔗 {publicUrl}
      </p>
    </div>
  );
}