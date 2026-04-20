"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login incorrecto");
      return;
    }

    const user = data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (profile && profile.slug) {
      router.replace(`/dashboard/${profile.slug}`);
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>

      <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

        <button type="submit">Entrar</button>
      </form>

      {/* 🔥 BOTÓN REGISTRO */}
      <div style={{ marginTop: 20 }}>
        <p>¿No tienes cuenta?</p>

        <Link href="/register">
          <button
            style={{
              background: "black",
              color: "white",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
            }}
          >
            Regístrate
          </button>
        </Link>
      </div>
    </div>
  );
}