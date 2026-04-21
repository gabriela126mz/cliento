"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

export default function NegocioPage() {
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

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/negocio/${profile.slug}`
      : "";

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      {/* HERO */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontSize: 34 }}>{profile.business_name}</h1>
        <p style={{ color: "#555", fontSize: 18 }}>
          {profile.description}
        </p>
      </div>

      {/* 🟦 BANNER QUIÉNES SOMOS */}
      <section
        style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <h2>👋 Quiénes somos</h2>
        <p style={{ color: "#555" }}>
          Somos un negocio especializado en ofrecer atención rápida,
          personalizada y soluciones profesionales adaptadas a cada cliente.
        </p>
      </section>

      {/* SERVICIOS */}
      <h2 style={{ marginBottom: 15 }}>Servicios</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 15,
        }}
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 15,
              textAlign: "center",
            }}
          >
            <div
              style={{
                height: 80,
                background: "#f0f0f0",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />

            <h3>Servicio {item}</h3>
            <p style={{ fontSize: 14, color: "#666" }}>
              Descripción del servicio
            </p>

            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "8px 12px",
                background: "black",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Contactar
            </a>
          </div>
        ))}
      </div>

      {/* 🔗 REDES SOCIALES */}
      <section
        style={{
          marginTop: 40,
          textAlign: "center",
        }}
      >
        <h3>🔗 Síguenos</h3>

        <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
          <a href="#" style={{ color: "blue" }}>
            Instagram
          </a>
          <a href="#" style={{ color: "black" }}>
            TikTok
          </a>
          <a href="#" style={{ color: "green" }}>
            Web
          </a>
        </div>
      </section>

      {/* CONTACTO */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <a
          href={`https://wa.me/${profile.whatsapp}`}
          target="_blank"
          style={{
            padding: "12px 18px",
            background: "green",
            color: "white",
            borderRadius: 10,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          📲 Abrir WhatsApp
        </a>
      </div>

      {/* QR */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <QRCodeCanvas value={url} size={130} />
      </div>

      {/* 🧾 FOOTER */}
      <footer
        style={{
          marginTop: 50,
          borderTop: "1px solid #eee",
          paddingTop: 20,
          textAlign: "center",
          color: "#999",
          fontSize: 12,
        }}
      >
        © {new Date().getFullYear()} {profile.business_name} · Creado con Cliento
      </footer>
    </main>
  );
}