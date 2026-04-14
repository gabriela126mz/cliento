export default function Home() {
  return (
    <main style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h1>Cliento</h1>
      <p>Crea tu página profesional en minutos.</p>

      <form style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px", marginTop: "20px" }}>
        <input type="text" placeholder="Nombre del negocio" style={{ padding: "12px" }} />
        <textarea placeholder="Describe tu servicio" style={{ padding: "12px", minHeight: "100px" }} />
        <input type="text" placeholder="WhatsApp" style={{ padding: "12px" }} />
        <button type="submit" style={{ padding: "12px", cursor: "pointer" }}>
          Crear mi página
        </button>
      </form>
    </main>
  );
}