"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Clientes() {
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    schedule: "",
    status: "nuevo",
  });

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  const loadClients = async () => {
    const user = await getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id)
      .order("created_at", { ascending: false });

    setClients(data || []);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ CREAR CLIENTE
  const addClient = async (e: any) => {
    e.preventDefault();

    const user = await getUser();
    if (!user) return;

    await supabase.from("clients").insert([
      {
        auth_id: user.id,
        ...form,
      },
    ]);

    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      schedule: "",
      status: "nuevo",
    });

    loadClients();
  };

  // 🗑 BORRAR
  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    loadClients();
  };

  // ✏️ EDITAR (abrir)
  const startEdit = (client: any) => {
    setEditingId(client.id);
    setForm({
      name: client.name || "",
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      schedule: client.schedule || "",
      status: client.status || "nuevo",
    });
  };

  // 💾 GUARDAR EDIT
  const saveEdit = async () => {
    await supabase
      .from("clients")
      .update(form)
      .eq("id", editingId);

    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      schedule: "",
      status: "nuevo",
    });

    loadClients();
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>

      <button onClick={() => router.push("/panel")}>
        ← Volver al panel
      </button>

      <h2>👥 CRM Clientes</h2>

      {/* FORM */}
      <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(); } : addClient}
        style={{ display: "grid", gap: 8, maxWidth: 400 }}>

        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" />
        <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="Horario" />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="cerrado">Cerrado</option>
        </select>

        <button type="submit">
          {editingId ? "💾 Guardar cambios" : "➕ Añadir cliente"}
        </button>
      </form>

      {/* LISTADO */}
      <div style={{ marginTop: 30 }}>
        {clients.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>

            <b>{c.name}</b>
            <p>{c.phone}</p>
            <p>{c.email}</p>
            <p>{c.status}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => startEdit(c)}>
                ✏️ Editar
              </button>

              <button onClick={() => deleteClient(c.id)}>
                🗑 Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}