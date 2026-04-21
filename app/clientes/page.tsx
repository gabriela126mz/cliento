"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const router = useRouter();

  const [clients, setClients] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");

  // 🔐 USER
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  // 📥 LOAD CLIENTS
  const fetchClients = async () => {
    const user = await getUser();

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id)
      .order("created_at", { ascending: false });

    setClients(data || []);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ➕ ADD CLIENT
  const addClient = async (e) => {
    e.preventDefault();

    const user = await getUser();

    await supabase.from("clients").insert([
      {
        auth_id: user.id,
        name,
        phone,
        email,
        address,
        schedule,
        status: "activo",
      },
    ]);

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSchedule("");

    fetchClients();
  };

  // 🔴 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>👥 Clientes</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => router.push("/panel")}>
            ← Panel
          </button>

          <button onClick={logout} style={{ background: "red", color: "white" }}>
            Logout
          </button>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={addClient}
        style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 400 }}
      >
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="Horario" value={schedule} onChange={(e) => setSchedule(e.target.value)} />

        <button type="submit">➕ Añadir cliente</button>
      </form>

      {/* LISTA */}
      <div style={{ marginTop: 30 }}>
        <h3>📋 Lista de clientes</h3>

        {clients.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
            <b>{c.name}</b>
            <p>📞 {c.phone}</p>
            <p>📧 {c.email}</p>
            <p>📍 {c.address}</p>
            <p>🕒 {c.schedule}</p>
            <p>📌 {c.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}