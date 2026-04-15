"use client";

import { useEffect, useState } from "react";
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

    const generatedSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const { error } = await supabase.from("profiles").insert([
      {
        business_name: businessName,
        description: description,
        whatsapp: whatsapp,
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
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>Cliento</h1>
      <p>Crea tu página profesional en minutos.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          placeholder="Nombre del negocio"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <textarea
          placeholder="Describe tu servicio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button type="submit">Crear mi página</button>

        {message && <p>{message}</p>}

        {slug && (
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <a
              href={`/negocio/${slug}`}
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
              Ver mi página 🚀
            </a>

            <a
              href={`/dashboard/${slug}`}
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
        )}
      </form>

      <h2 style={{ marginTop: "40px" }}>Perfiles creados</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {profiles.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>{p.business_name}</strong>
            <p>{p.description}</p>
            <p>📱 {p.whatsapp}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <a
                href={`/negocio/${p.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "black",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Ver mi página 🚀
              </a>

              <a
                href={`/dashboard/${p.slug}`}
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "blue",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Editar ⚙️
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}