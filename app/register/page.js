"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    // 🔥 crear profile vacío
    await supabase.from("profiles").insert([
      {
        auth_id: user.id,
        business_name: "",
        description: "",
        whatsapp: "",
        slug: "",
      },
    ]);

    // 🚀 ir al dashboard (NO login)
    router.replace("/dashboard");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1>Registro</h1>

      <form onSubmit={register}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Crear cuenta</button>
      </form>
    </div>
  );
}