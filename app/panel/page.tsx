"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

export default function Panel() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [publicUrl, setPublicUrl] = useState("");

  // CLIENT FORM
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  // 🔵 LOAD EVERYTHING
  useEffect(() => {
    const load = async () => {
      const user = await getUser();
      if (!user) return router.push("/login");

      setUserEmail(user.email || "");

      // PROFILE
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      setProfile(prof);

      if (prof) {
        setPublicUrl(`${window.location.origin}/negocio/${prof.slug}`);
      }

      // CLIENTS
      const { data: cli } = await supabase
        .from("clients")
        .select("*")
        .eq("auth_id", user.id)
        .order("created_at", { ascending: false });

      setClients(cli || []);
    };

    load();
  }, []);

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ➕ ADD CLIENT
  const addClient = async (e: any) => {
    e.preventDefault();

    const user = await getUser();

    await supabase.from("clients").insert([
      {
        auth_id: user.id,
        name,
        phone,
      },
    ]);

    setName("");
    setPhone("");

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id)
      .order("created_at", { ascending: false });

    setClients(data || []);
  };

  // 🗑 DELETE
  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);

    const user = await getUser();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id);

    setClients(data || []);
  };

  // ✏️ EDIT
  const editClient = async (client: any) => {
    const newName = prompt("Nombre", client.name);
    const newPhone = prompt("Teléfono", client.phone);

    if (!newName) return;

    await supabase
      .from("clients")
      .update({
        name: newName,
        phone: newPhone,
      })
      .eq("id", client.id);

    const user = await getUser();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id);

    setClients(data || []);
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>👋 {userEmail}</h2>

        <button onClick={logout} style={{ background: "red", color: "white" }}>
          Cerrar sesión
        </button>
      </div>

      {/* 🧠 NEGOCIO */}
      {profile && (
        <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 10, marginTop: 20 }}>
          <h3>📊 Tu negocio</h3>

          <p><b>Nombre:</b> {profile.business_name}</p>
          <p><b>Descripción:</b> {profile.description}</p>
          <p><b>WhatsApp:</b> {profile.whatsapp}</p>

          {/* BOTONES LIMPIOS */}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>

            <a
              href={`/negocio/${profile.slug}`}
              target="_blank"
              style={{
                background: "black",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              🌐 Ver web
            </a>

            <a
              href={`/dashboard/${profile.slug}`}
              style={{
                background: "blue",
                color: "white",
                padding: "10px 14px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              ✏️ Editar
            </a>

          </div>

          {/* QR */}
          <div style={{ marginTop: 15 }}>
            <h4>📱 QR</h4>
            <QRCodeCanvas value={publicUrl} size={140} />
          </div>
        </div>
      )}

      {/* ➕ CLIENTES */}
      <div style={{ marginTop: 30 }}>
        <h3>👥 Clientes</h3>

        <form onSubmit={addClient} style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button type="submit">Añadir</button>
        </form>

        {/* LISTA */}
        <div style={{ marginTop: 20 }}>
          {clients.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <b>{c.name}</b>
              <p>{c.phone}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => editClient(c)}>✏️ Editar</button>
                <button onClick={() => deleteClient(c.id)}>🗑 Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}