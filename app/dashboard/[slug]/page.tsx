"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [profile, setProfile] = useState<any>(null);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { slug } = await params;
      setSlug(slug);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error(error);
      } else if (data) {
        setProfile(data);
        setBusinessName(data.business_name || "");
        setDescription(data.description || "");
        setWhatsapp(data.whatsapp || "");
      }
    };

    loadProfile();
  }, [params]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        description: description,
        whatsapp: whatsapp,
      })
      .eq("id", profile.id);

    if (error) {
      console.error(error);
      setMessage("Error al actualizar");
    } else {
      setMessage("Actualizado correctamente ✅");
    }
  };

  if (!profile) {
    return (
      <main style={{ padding: "24px", fontFamily: "Arial" }}>
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>Editar perfil</h1>
      <p>Slug: {slug}</p>

      <form
        onSubmit={handleUpdate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button type="submit">Guardar cambios</button>

        {message && <p>{message}</p>}
      </form>

      <a
        href={`/negocio/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 14px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Ver página pública 🚀
      </a>
    </main>
  );
}