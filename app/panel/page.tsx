"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function Panel() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [publicUrl, setPublicUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      setProfile(prof);

      if (prof?.slug) {
        setPublicUrl(`${window.location.origin}/negocio/${prof.slug}`);
      }
    };

    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>👋 Hola {userEmail}</h2>
          <p>Panel de control</p>
        </div>

        <button onClick={logout} style={{ background: "red", color: "white" }}>
          Cerrar sesión
        </button>
      </div>

      {/* NEGOCIO */}
      {profile && (
        <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 10 }}>
          <h3>📊 Tu negocio</h3>

          <p><b>Nombre:</b> {profile.business_name}</p>
          <p><b>Descripción:</b> {profile.description}</p>
          <p><b>WhatsApp:</b> {profile.whatsapp}</p>

          {/* ACCIONES */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

            <a
              href={`/negocio/${profile.slug}`}
              target="_blank"
              style={{
                background: "black",
                color: "white",
                padding: 10,
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              🌐 Ver web
            </a>

            <a
              href={`/dashboard/${profile.slug}`}
              style={{
                background: "blue",
                color: "white",
                padding: 10,
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              ✏️ Editar
            </a>

            <button
              onClick={() => router.push("/clientes")}
              style={{
                background: "green",
                color: "white",
                padding: 10,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              👥 CRM Clientes
            </button>
          </div>

          {/* QR */}
          <div style={{ marginTop: 15 }}>
            <QRCodeCanvas value={publicUrl} size={140} />
          </div>
        </div>
      )}
    </main>
  );
}