"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Edit() {
  const { slug } = useParams();
  const router = useRouter();

  const [business_name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        setName(data.business_name || "");
        setDescription(data.description || "");
        setWhatsapp(data.whatsapp || "");
      }
    };

    load();
  }, [slug]);

  const save = async (e) => {
    e.preventDefault();

    await supabase
      .from("profiles")
      .update({
        business_name,
        description,
        whatsapp,
      })
      .eq("slug", slug);

    router.replace(`/dashboard/${slug}`);
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>✏️ Editar negocio</h1>

      <form onSubmit={save}>
        <input value={business_name} onChange={(e) => setName(e.target.value)} />
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <button>Guardar</button>
      </form>
    </div>
  );
}