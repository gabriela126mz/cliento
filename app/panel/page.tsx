"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Panel() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);

  // 🔴 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // 🔵 OBTENER USUARIO + NEGOCIO
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      // buscar su negocio
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", user.id)
        .limit(1)
        .single();

      setProfile(data);
    };

    load();
  }, []);

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>👋 Hola {userEmail}</h2>
          <p style={{ margin: 0, color: "#666" }}>
            Bienvenido a tu panel de control
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 14px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* SI NO TIENE NEGOCIO */}
      {!profile ? (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h3>🚀 No tienes negocio aún</h3>
          <p>Crea tu primera página para empezar a recibir clientes.</p>

          <button
            onClick={() => router.push("/crear")}
            style={{
              padding: "10px 14px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Crear negocio
          </button>
        </div>
      ) : (
        <>
          {/* NEGOCIO */}
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <h3>📊 Tu negocio</h3>

            <p>
              <strong>Nombre:</strong> {profile.business_name}
            </p>

            <p>
              <strong>Descripción:</strong> {profile.description}
            </p>

            <p>
              <strong>WhatsApp:</strong> {profile.whatsapp}
            </p>

            <p>
              <strong>Slug:</strong> {profile.slug}
            </p>
          </div>

          {/* ACCIONES */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={`/negocio/${profile.slug}`}
              target="_blank"
              style={{
                padding: "10px 14px",
                background: "black",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              🌐 Ver mi web
            </a>

            <a
              href={`/dashboard/${profile.slug}`}
              style={{
                padding: "10px 14px",
                background: "blue",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              ✏️ Editar negocio
            </a>
          </div>

          {/* FUTURO CRM */}
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px dashed #ccc",
              borderRadius: "12px",
            }}
          >
            <h3>👥 Clientes (próximamente)</h3>
            <p>Aquí verás tus contactos y seguimientos.</p>
          </div>
        </>
      )}
    </main>
  );
}