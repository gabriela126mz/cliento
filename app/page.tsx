"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from("profiles").insert([
      {
        business_name: businessName,
        description: description,
        whatsapp: whatsapp,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Error al guardar");
    } else {
      setMessage("Guardado correctamente ✅");
      setBusinessName("");
      setDescription("");
      setWhatsapp("");
    }
  };

  return (
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>Cliento</h1>
      <p>Crea tu página profesional en minutos.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        
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

      </form>
    </main>
  );
}