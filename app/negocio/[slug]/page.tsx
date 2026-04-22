"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const { slug } = useParams();
  const [profile, setProfile] = useState<any>(null);

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
    <main style={{ fontFamily: "Poppins, sans-serif", background: "#f7fdf8" }}>

      {/* 🔝 NAVBAR */}
      <nav style={nav}>
        <h2 style={{ fontSize: 28 }}>{profile.business_name}</h2>

        <div style={menu}>
          <a href="#servicios">Servicios</a>
          <a href="#sobre">Sobre mí</a>
          <a href="#galeria">Galería</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      {/* 🔥 HERO */}
      <section style={hero}>
        <div style={overlay} />

        <div style={heroContent}>
          <h1 style={title}>
            Impulsa tu negocio con resultados reales
          </h1>

          <p style={subtitle}>
            {profile.description}
          </p>

          <div style={{ display: "flex", gap: 15 }}>
            <a href="#contacto" style={btnPrimary}>
              Solicitar presupuesto
            </a>

            <a href="#servicios" style={btnSecondary}>
              Ver servicios
            </a>
          </div>
        </div>

        {/* WhatsApp grande */}
        <a
          href={`https://wa.me/${profile.whatsapp}`}
          target="_blank"
          style={whatsapp}
        >
          💬
        </a>

        {/* Redes */}
        <div style={social}>
          <div>📷</div>
          <div>🎵</div>
          <div>🌐</div>
        </div>
      </section>

      {/* 💡 SLOGAN */}
      <section style={slogan}>
        <h2 style={{ fontSize: 34 }}>
          Creatividad con propósito
        </h2>
        <p>
          Ayudamos a negocios a crecer con estrategias reales y soluciones modernas.
        </p>
      </section>

      {/* 🟩 SERVICIOS */}
      <section id="servicios" style={section}>
        <h2 style={sectionTitle}>Servicios</h2>

        <div style={services}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={card}>
              <div style={img}></div>

              <h3 style={{ marginTop: 20 }}>Servicio {s}</h3>

              <p style={{ margin: "10px 0 20px" }}>
                Descripción profesional del servicio.
              </p>

              <a
                href={`https://wa.me/${profile.whatsapp}`}
                style={btnPrimary}
              >
                Contactar
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 SOBRE / QUIÉNES SOMOS */}
      <section id="sobre" style={about}>
        <div style={{ flex: 1 }}>
          <h2>Quiénes somos</h2>

          <p>
            Somos un negocio enfocado en ofrecer soluciones eficaces,
            rápidas y adaptadas a cada cliente.
          </p>

          <ul>
            <li>✔ Atención rápida</li>
            <li>✔ Experiencia profesional</li>
            <li>✔ Resultados reales</li>
          </ul>
        </div>

        <div style={aboutImg}></div>
      </section>

      {/* ⭐ POR QUÉ ELEGIRNOS */}
      <section style={why}>
        <h2 style={sectionTitle}>¿Por qué elegirnos?</h2>

        <div style={features}>
          {[
            { icon: "🎓", title: "Formación", text: "Equipo cualificado" },
            { icon: "⏱", title: "Experiencia", text: "Años en el sector" },
            { icon: "🛠", title: "Calidad", text: "Material premium" },
          ].map((f, i) => (
            <div key={i} style={feature}>
              <div style={icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🖼 GALERÍA */}
      <section id="galeria" style={section}>
        <h2 style={sectionTitle}>Trabajos realizados</h2>

        <div style={gallery}>
          {[1, 2, 3].map((g) => (
            <div key={g} style={galleryItem}></div>
          ))}
        </div>
      </section>

      {/* 📩 CONTACTO */}
      <section id="contacto" style={contact}>
        <div style={form}>
          <h2>Solicita tu presupuesto</h2>
          <p>Sin compromiso</p>

          <input placeholder="Nombre" style={input} />
          <input placeholder="Teléfono" style={input} />
          <textarea placeholder="Cuéntanos..." style={input} />

          <a
            href={`https://wa.me/${profile.whatsapp}`}
            style={btnPrimary}
          >
            Enviar por WhatsApp
          </a>
        </div>
      </section>

      {/* 🧾 FOOTER */}
      <footer style={footer}>
        <div style={footerGrid}>
          <div>
            <h3>{profile.business_name}</h3>
            <p>{profile.description}</p>
          </div>

          <div>
            <h4>Servicios</h4>
            <p>Diseño</p>
            <p>Mantenimiento</p>
          </div>

          <div>
            <h4>Contacto</h4>
            <p>📞 {profile.whatsapp}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* 🎨 ESTILOS */

const nav = {
  position: "fixed",
  width: "100%",
  top: 0,
  background: "white",
  padding: "15px 40px",
  display: "flex",
  justifyContent: "space-between",
  zIndex: 10,
};

const menu = {
  display: "flex",
  gap: 20,
};

const hero = {
  height: "100vh",
  background:
    "url(https://images.unsplash.com/photo-1501004318641-b39e6451bec6) center/cover",
  display: "flex",
  alignItems: "center",
  padding: "80px 40px",
  color: "white",
  position: "relative",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
};

const heroContent = { position: "relative", maxWidth: 600 };

const title = { fontSize: 56, fontWeight: "bold" };
const subtitle = { fontSize: 20, margin: "20px 0" };

const btnPrimary = {
  background: "#2e7d32",
  padding: "14px 22px",
  color: "white",
  borderRadius: 8,
};

const btnSecondary = {
  border: "1px solid white",
  padding: "14px 22px",
  borderRadius: 8,
};

const whatsapp = {
  position: "fixed",
  bottom: 30,
  right: 30,
  background: "#25D366",
  padding: 22,
  borderRadius: "50%",
  fontSize: 26,
};

const social = {
  position: "fixed",
  right: 20,
  top: "40%",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const slogan = {
  textAlign: "center",
  padding: 50,
};

const section = {
  padding: "80px 20px",
  maxWidth: 1200,
  margin: "0 auto",
};

const sectionTitle = {
  textAlign: "center",
  fontSize: 32,
  marginBottom: 40,
};

const services = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 30,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
};

const img = {
  height: 250,
  background:
    "url(https://images.unsplash.com/photo-1466692476868-aef1dfb1e735) center/cover",
  borderRadius: 10,
};

const about = {
  display: "flex",
  gap: 40,
  padding: 80,
  alignItems: "center",
};

const aboutImg = {
  flex: 1,
  height: 300,
  background:
    "url(https://images.unsplash.com/photo-1501004318641-b39e6451bec6) center/cover",
};

const why = {
  background: "#e8f5e9",
  padding: 80,
};

const features = {
  display: "flex",
  justifyContent: "center",
  gap: 30,
};

const feature = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  textAlign: "center",
};

const icon = { fontSize: 40 };

const gallery = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20,
};

const galleryItem = {
  height: 250,
  background:
    "url(https://images.unsplash.com/photo-1501004318641-b39e6451bec6) center/cover",
};

const contact = {
  padding: 80,
  display: "flex",
  justifyContent: "center",
};

const form = {
  background: "white",
  padding: 30,
  borderRadius: 12,
  width: 400,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const footer = {
  background: "#1b5e20",
  color: "white",
  padding: 40,
};

const footerGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
};