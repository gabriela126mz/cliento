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

  // FORM CLIENT
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("");
  const [status, setStatus] = useState("nuevo");

  // EDIT MODAL
  const [editingClient, setEditingClient] = useState<any>(null);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  };

  // LOAD
  useEffect(() => {
    const load = async () => {
      const user = await getUser();
      if (!user) return router.push("/login");

      setUserEmail(user.email || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      setProfile(prof);

      if (prof) {
        setPublicUrl(`${window.location.origin}/negocio/${prof.slug}`);
      }

      const { data: cli } = await supabase
        .from("clients")
        .select("*")
        .eq("auth_id", user.id)
        .order("created_at", { ascending: false });

      setClients(cli || []);
    };

    load();
  }, []);

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ADD CLIENT
  const addClient = async (e: any) => {
    e.preventDefault();

    const user = await getUser();
    if (!user) return;

    const { error } = await supabase.from("clients").insert([
      {
        auth_id: user.id,
        name: name || "",
        phone: phone || "",
        email: email || "",
        address: address || "",
        schedule: schedule || "",
        status: status || "nuevo",
      },
    ]);

    if (error) {
      console.error("INSERT ERROR:", error);
      alert("Error al guardar cliente");
      return;
    }

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSchedule("");
    setStatus("nuevo");

    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id);

    setClients(data || []);
  };

  // DELETE
  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);

    const user = await getUser();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("auth_id", user.id);

    setClients(data || []);
  };

  // UPDATE
  const updateClient = async () => {
    await supabase
      .from("clients")
      .update({
        name: editingClient.name,
        phone: editingClient.phone,
        email: editingClient.email,
        address: editingClient.address,
        schedule: editingClient.schedule,
        status: editingClient.status,
      })
      .eq("id", editingClient.id);

    setEditingClient(null);

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

      {/* NEGOCIO */}
      {profile && (
        <div style={{ border: "1px solid #ddd", padding: 15, borderRadius: 10 }}>
          <h3>📊 Tu negocio</h3>

          <p><b>Nombre:</b> {profile.business_name}</p>
          <p><b>Descripción:</b> {profile.description}</p>
          <p><b>WhatsApp:</b> {profile.whatsapp}</p>

          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={`/negocio/${profile.slug}`}
              target="_blank"
              style={{
                background: "black",
                color: "white",
                padding: 10,
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
                padding: 10,
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              ✏️ Editar
            </a>
          </div>

          <div style={{ marginTop: 10 }}>
            <QRCodeCanvas value={publicUrl} size={140} />
          </div>
        </div>
      )}

      {/* FORM */}
      <h3 style={{ marginTop: 30 }}>➕ Añadir cliente</h3>

      <form onSubmit={addClient} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
        <input value={name || ""} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <input value={phone || ""} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" />
        <input value={email || ""} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={address || ""} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" />
        <input value={schedule || ""} onChange={(e) => setSchedule(e.target.value)} placeholder="Horario" />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="cerrado">Cerrado</option>
        </select>

        <button type="submit">Guardar cliente</button>
      </form>

      {/* LIST */}
      <h3 style={{ marginTop: 30 }}>👥 Clientes</h3>

      {clients.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
          <b>{c.name}</b> — {c.phone}
          <p>{c.email}</p>
          <p>{c.status}</p>

          <button onClick={() => setEditingClient(c)}>✏️ Editar</button>
          <button onClick={() => deleteClient(c.id)}>🗑 Eliminar</button>
        </div>
      ))}

      {/* MODAL EDIT */}
      {editingClient && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ background: "white", padding: 20, borderRadius: 10, width: 400 }}>
            <h3>Editar cliente</h3>

            <input
              value={editingClient.name || ""}
              onChange={(e) =>
                setEditingClient({ ...editingClient, name: e.target.value })
              }
            />

            <input
              value={editingClient.phone || ""}
              onChange={(e) =>
                setEditingClient({ ...editingClient, phone: e.target.value })
              }
            />

            <input
              value={editingClient.email || ""}
              onChange={(e) =>
                setEditingClient({ ...editingClient, email: e.target.value })
              }
            />

            <button onClick={updateClient}>Guardar</button>
            <button onClick={() => setEditingClient(null)}>Cancelar</button>
          </div>
        </div>
      )}

    </main>
  );
}