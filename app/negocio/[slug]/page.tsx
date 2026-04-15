import { supabase } from "@/lib/supabase";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return (
      <main style={{ padding: "24px", fontFamily: "Arial" }}>
        <h1>No encontrado</h1>
        <p>Este perfil no existe.</p>
        <p>Slug recibido: {slug}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "24px", fontFamily: "Arial" }}>
      <h1>{data.business_name}</h1>
      <p>{data.description}</p>

      <a
        href={`https://wa.me/${data.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 14px",
          background: "green",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Contactar por WhatsApp
      </a>
    </main>
  );
}