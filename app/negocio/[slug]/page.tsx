"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QRCodeCanvas } from "qrcode.react";

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

  if (!profile) return <p style={{ padding: 40 }}>Cargando...</p>;

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/negocio/${profile.slug}`
      : "";

  return (
    <main style={{ fontFamily: "Inter, Arial", background: "#f4fdf7" }}>

      {/* 🌿 NAV */}
      <nav style={nav}>
        <h2 style={{ fontSize: 24 }}>{profile.business_name}</h2>
        <div style={menu}>
          <a href="#servicios">Servicios</a>
          <a href="#sobre">Empresa</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      {/* 🟢 HERO */}
      <section style={hero}>
        <div style={{ maxWidth: 600 }}>
          <h1 style={{ fontSize: 52, marginBottom: 10 }}>
            {profile.business_name}
          </h1>

          <p style={{ fontSize: 20, color: "#d1fae5" }}>
            {profile.description}
          </p>

          <a href="#contacto" style={cta}>
            Solicitar presupuesto
          </a>
        </div>
      </section>

      {/* 🧠 QUIÉNES SOMOS */}
      <section id="sobre" style={sectionCenter}>
        <h2 style={{ fontSize: 32 }}>Quiénes somos</h2>

        <p style={{ maxWidth: 600, margin: "10px auto", color: "#555" }}>
          Negocio especializado en soluciones profesionales, rápidas y adaptadas a cada cliente.
        </p>

        {/* TARJETAS GRANDES */}
        <div style={cardsGrid}>
          {[
            { icon: "⚡", title: "Atención rápida" },
            { icon: "🧠", title: "Experiencia" },
            { icon: "📈", title: "Resultados reales" },
          ].map((item, i) => (
            <div key={i} className="bigCard">
              <div style={{ fontSize: 40 }}>{item.icon}</div>
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 🟩 BLOQUES EMPRESA */}
      <section style={section}>
        <div style={grid3}>
          <div className="infoBox">
            <h3>Formación</h3>
            <p>
              Profesionales cualificados con conocimientos avanzados en el sector.
            </p>
          </div>

          <div className="infoBox">
            <h3>Experiencia</h3>
            <p>
              Años de experiencia ofreciendo soluciones reales a nuestros clientes.
            </p>
          </div>

          <div className="infoBox">
            <h3>Materiales</h3>
            <p>
              Trabajamos con productos de calidad y técnicas modernas.
            </p>
          </div>
        </div>
      </section>

      {/* 🟢 SERVICIOS */}
      <section id="servicios" style={section}>
        <h2 style={{ textAlign: "center" }}>Servicios</h2>

        <div style={services}>
          {[1, 2, 3].map((s) => (
            <div key={s} className="serviceCard">
              <div style={img}></div>

              <h3>Servicio {s}</h3>
              <p>Descripción clara del servicio.</p>

              <a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                style={btn}
              >
                Contactar
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 📩 CONTACTO */}
      <section id="contacto" style={contact}>
        <div style={{ maxWidth: 500 }}>
          <h2>Solicita información</h2>
          <p>Te respondemos sin compromiso</p>

          <input placeholder="Nombre" style={input} />
          <input placeholder="Teléfono" style={input} />
          <textarea placeholder="¿Qué necesitas?" style={input} />

          <a
            href={`https://wa.me/${profile.whatsapp}`}
            target="_blank"
            style={ctaWhite}
          >
            Enviar por WhatsApp
          </a>
        </div>
      </section>

      {/* 🔗 REDES */}
      <section style={sectionCenter}>
        <h3>Síguenos</h3>
        <div style={socials}>
          <div className="social">📷 Instagram</div>
          <div className="social">🎵 TikTok</div>
          <div className="social">🌐 Web</div>
        </div>
      </section>

      {/* 📱 QR ABAJO */}
      <div style={{ textAlign: "center", padding: 20 }}>
        <QRCodeCanvas value={url} size={120} />
      </div>

      {/* 🧾 FOOTER */}
      <footer style={footer}>
        <div style={footerGrid}>
          <div>
            <h3>{profile.business_name}</h3>
            <p>{profile.description}</p>
          </div>

          <div>
            <h4>Servicios</h4>
            <p>Servicio 1</p>
            <p>Servicio 2</p>
          </div>

          <div>
            <h4>Contacto</h4>
            <p>📞 {profile.whatsapp}</p>
            <p>Email@empresa.com</p>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: 12 }}>
          © 2026 · Cliento
        </p>
      </footer>

      {/* ✨ ANIMACIONES */}
      <style jsx>{`
        .bigCard {
          background: white;
          padding: 30px;
          border-radius: 14px;
          text-align: center;
          transition: 0.3s;
        }

        .bigCard:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .infoBox {
          background: #dcfce7;
          padding: 20px;
          border-radius: 12px;
        }

        .serviceCard {
          background: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          transition: 0.3s;
        }

        .serviceCard:hover {
          transform: scale(1.03);
        }

        .social {
          padding: 12px;
          background: #dcfce7;
          border-radius: 8px;
        }
      `}</style>
    </main>
  );
}

/* 🎨 ESTILOS */

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: 20,
  background: "#065f46",
  color: "white",
};

const menu = { display: "flex", gap: 20 };

const hero = {
  padding: "100px 20px",
  background: "linear-gradient(135deg,#065f46,#10b981,#34d399)",
  color: "white",
  textAlign: "center",
};

const cta = {
  marginTop: 20,
  display: "inline-block",
  background: "white",
  color: "#065f46",
  padding: "12px 18px",
  borderRadius: 8,
};

const section = {
  padding: "60px 20px",
  maxWidth: 1100,
  margin: "0 auto",
};

const sectionCenter = {
  padding: "60px 20px",
  textAlign: "center",
};

const cardsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
  marginTop: 30,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 20,
};

const services = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
  gap: 20,
  marginTop: 30,
};

const img = {
  height: 180,
  background:
    "url(https://images.unsplash.com/photo-1498050108023-c5249f4df085) center/cover",
  borderRadius: 10,
  marginBottom: 10,
};

const btn = {
  display: "inline-block",
  marginTop: 10,
  background: "#10b981",
  color: "white",
  padding: "10px 14px",
  borderRadius: 6,
};

const contact = {
  padding: "60px 20px",
  background: "#065f46",
  color: "white",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "none",
};

const ctaWhite = {
  display: "inline-block",
  background: "white",
  color: "#065f46",
  padding: "12px 18px",
  borderRadius: 8,
};

const socials = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 20,
};

const footer = {
  background: "#022c22",
  color: "white",
  padding: 40,
};

const footerGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 20,
};