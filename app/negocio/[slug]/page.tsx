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

  if (!profile) return <div className="p-10">Cargando...</div>;

  return (
    <main className="bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* FIXED SOCIAL */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-50">
        <a href="#" className="text-pink-500 text-3xl hover:scale-110 transition">📸</a>
        <a href="#" className="text-black text-3xl hover:scale-110 transition">🎵</a>
        <a href="#" className="text-blue-600 text-3xl hover:scale-110 transition">💼</a>
      </div>

      {/* WHATSAPP */}
      <a
        href={`https://wa.me/${profile.whatsapp}`}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-5 rounded-full shadow-2xl text-2xl z-50 animate-pulse"
      >
        💬
      </a>

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur border-b z-40 flex justify-between items-center px-6 md:px-10 py-4">

        <div className="flex items-center gap-3 font-bold text-xl">
          <div className="w-9 h-9 bg-green-500 rounded-full"></div>
          {profile.business_name}
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#servicios">Servicios</a>
          <a href="#galeria">Galería</a>
          <a href="#sobre">Quiénes somos</a>
          <a href="#por-que">Por qué</a>
          <a href="#contacto">Contacto</a>
        </div>

        <a
          href={`https://wa.me/${profile.whatsapp}`}
          className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          WhatsApp
        </a>
      </nav>

      {/* HERO */}
      <section className="h-screen flex items-center justify-center px-6 bg-gradient-to-b from-gray-50 to-white text-center">
        <div className="max-w-3xl">

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
            {profile.business_name}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Agencia digital enfocada en crecimiento real
          </p>

          <a
            href={`https://wa.me/${profile.whatsapp}`}
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition inline-block"
          >
            Solicitar propuesta sin compromiso
          </a>
        </div>
      </section>

      {/* KPI */}
      <section className="py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center px-6">

          {[
            { n: "+20K€", t: "Facturación media clientes" },
            { n: "+120%", t: "Crecimiento en leads" },
            { n: "48h", t: "Tiempo de respuesta" },
          ].map((k, i) => (
            <div key={i} className="p-10 border rounded-2xl shadow hover:shadow-xl transition">
              <div className="text-5xl font-black text-green-600">{k.n}</div>
              <div className="text-gray-600 mt-2">{k.t}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-24 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12">Servicios</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">

          {[
            {
              t: "Branding",
              img: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
            },
            {
              t: "Ads Performance",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            },
            {
              t: "Web Conversion",
              img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            }
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg hover:scale-105 transition overflow-hidden">
              <img src={s.img} className="h-52 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{s.t}</h3>
                <p className="text-gray-600">Estrategia enfocada en resultados reales.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="py-24 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">Galería</h2>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto px-6">
          {[
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
            "https://images.unsplash.com/photo-1553877522-43269d4ea984",
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            "https://images.unsplash.com/photo-1556761175-b413da4baf72",
            "https://images.unsplash.com/photo-1522202228886-6c5b1c3c1f1a",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
          ].map((img, i) => (
            <img
              key={i}
              src={img}
              className="h-64 w-full object-cover rounded-xl hover:scale-105 transition"
            />
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 items-center">

          <div>
            <h2 className="text-4xl font-bold mb-4">Quiénes somos</h2>
            <p className="text-gray-600 text-lg">
              Somos un equipo especializado en crecimiento digital, publicidad y conversión.
            </p>
          </div>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            className="rounded-2xl shadow-lg"
          />

        </div>
      </section>

      {/* POR QUE */}
      <section id="por-que" className="py-24 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">¿Por qué nosotros?</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 text-center">

          <div className="p-10 border rounded-2xl hover:shadow-xl transition">
            <div className="text-5xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Resultados</h3>
            <p className="text-gray-600">Enfoque real en resultados medibles.</p>
          </div>

          <div className="p-10 border rounded-2xl hover:shadow-xl transition">
            <div className="text-5xl mb-3">🧠</div>
            <h3 className="text-xl font-bold mb-2">Estrategia</h3>
            <p className="text-gray-600">Enfoque real en resultados medibles.</p>
          </div>

          <div className="p-10 border rounded-2xl hover:shadow-xl transition">
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-2">Crecimiento</h3>
            <p className="text-gray-600">Enfoque real en resultados medibles.</p>
          </div>

        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-2xl">

          <h2 className="text-3xl font-bold text-center mb-2">Hablemos de tu proyecto</h2>
          <p className="text-center text-gray-500 mb-6">
            Sin compromiso. Cuéntanos tu idea.
          </p>

          <input className="w-full p-3 border rounded mb-3" placeholder="Nombre" />
          <input className="w-full p-3 border rounded mb-3" placeholder="Email" />
          <textarea className="w-full p-3 border rounded mb-4" placeholder="Mensaje" />

          <a
            href={`https://wa.me/${profile.whatsapp}`}
            className="block text-center bg-green-500 text-white py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Enviar por WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-14">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full"></div>
            <div>
              <h3 className="font-bold">{profile.business_name}</h3>
              <p className="text-gray-400">Digital Agency</p>
            </div>
          </div>

          <div>
            <p>📧 contacto@empresa.com</p>
            <p>📞 +34 XXX XXX XXX</p>
            <p>📍 Madrid</p>
          </div>

          <div className="flex flex-col gap-2">
            <a>Instagram</a>
            <a>TikTok</a>
            <a>LinkedIn</a>
          </div>

        </div>
      </footer>

    </main>
  );
}
