"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const { slug } = useParams();

  const [profile, setProfile] = useState(null);

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

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1>{profile.business_name}</h1>
      <p>{profile.description}</p>
      <p>{profile.whatsapp}</p>
    </div>
  );
}