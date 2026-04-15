"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProfiles(data || []);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!businessName.trim()) {
      setMessage("Escribe el nombre del negocio");
      return;
    }

    const generatedSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const { error } = await supabase.from("profiles").insert([
      {
        business_name: businessName,
        description,
        whatsapp,
        slug: generatedSlug,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Error al guardar");
    } else {
      setSlug(generatedSlug);
      setMessage("Guardado correctamente ✅");
      setBusinessName("");
      setDescription("");
      setWhatsapp("");
      fetchProfiles();
    }
  };

  return (
    <main
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Cliento</h1>
      <p style={{ marginTop: 0, marginBottom: "32px", color: "#444" }}>
        Crea tu página profesional y gestiona tus negocios.
      </p>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Crear negocio</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "420px",
          }}
        >
          <input
            type="text"
            placeholder="Nombre del negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <textarea
            placeholder="Describe tu servicio"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minHeight: "100px",
            }}
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 16px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            Crear mi página
          </button>

          {message && <p style={{ margin: 0 }}>{message}</p>}

          {slug && (
            <a
              href={`/negocio/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "4px",
                padding: "10px 14px",
                background: "#111",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                width: "fit-content",
              }}
            >
              Ver mi nueva página 🚀
            </a>
          )}
        </form>
      </section>

      <section>
        <h2>Mis negocios</h2>

        {profiles.length === 0 ? (
          <p style={{ color: "#666" }}>Todavía no has creado negocios.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {profiles.map((p) => {
              const publicUrl = `http://localhost:3000/negocio/${p.slug}`;

              return (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <strong style={{ fontSize: "18px" }}>{p.business_name}</strong>
                  <p style={{ margin: "8px 0" }}>{p.description}</p>
                  <p style={{ margin: "8px 0" }}>📱 {p.whatsapp}</p>
                  <p style={{ margin: "8px 0", color: "#666" }}>
                    Enlace: /negocio/{p.slug}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "18px",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      marginTop: "14px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a
                        href={`/negocio/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          padding: "10px 14px",
                          background: "black",
                          color: "white",
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        Ver web 🚀
                      </a>

                      <a
                        href={`/dashboard/${p.slug}`}
                        style={{
                          display: "inline-block",
                          padding: "10px 14px",
                          background: "blue",
                          color: "white",
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        Editar ⚙️
                      </a>
                    </div>

                    <div
                      style={{
                        border: "1px solid #eee",
                        borderRadius: "10px",
                        padding: "12px",
                        textAlign: "center",
                        background: "#fafafa",
                      }}
                    >
                      <p style={{ marginTop: 0, marginBottom: "10px" }}>QR del negocio</p>
                      <QRCodeCanvas value={publicUrl} size={120} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}