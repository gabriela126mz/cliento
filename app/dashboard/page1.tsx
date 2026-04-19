
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setProfile(data);
      setBusinessName(data.business_name);
      setDescription(data.description);
      setWhatsapp(data.whatsapp);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        description: description,
        whatsapp: whatsapp,
      })
      .eq("id", profile.id);

    if (error) {
      setMessage("Error al actualizar");
    } else {
      setMessage("Actualizado correctamente ✅");
    }
  };

  if (!profile) return <p>Cargando...</p>;

  return (
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>Dashboard</h1>

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
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button type="submit">Guardar cambios</button>

        {message && <p>{message}</p>}
      </form>
    </main>
  );
}

