"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const save = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const slug = businessName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        description,
        whatsapp,
        slug,
      })
      .eq("auth_id", user.id);

    router.replace(`/dashboard/${slug}`);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>Crear negocio</h1>

      <form onSubmit={save}>
        <input
          placeholder="Nombre"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <input
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button>Guardar</button>
      </form>
    </div>
  );
}