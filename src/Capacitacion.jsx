import { Link } from 'react-router-dom'
import './App.css'

function Capacitacion() {
  return (
    <main className="page-shell subpage-shell">
      <section className="hero-section subpage-hero">
        <header className="topbar">
          <Link className="brand" to="/" aria-label="Volver al inicio de Terralógica">
            <img className="brand-logo" src="/terralogics-imago.png" alt="Imago de Terralógica" />
            <span className="brand-text">Terralógica</span>
          </Link>
          <nav className="topnav" aria-label="Navegación secundaria">
            <Link to="/">Inicio</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro">
          <h1>Capacitación especializada en tecnologías espacialesy análisis territorial.</h1>
          <p className="hero-text">
            Formamos equipos con habilidades prácticas y conceptos estratégicos para gestionar información territorial con eficacia.
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Nuestro enfoque</p>
        </div>
        <div className="service-grid">
          <article className="service-card">
            <h3>Capacitación técnica</h3>
            <p>
              Cursos y talleres prácticos enfocados en el uso de herramientas geoespaciales y análisis aplicado a problemas reales.
            </p>
          </article>
          <article className="service-card">
            <h3>Desarrollo de capacidades internas</h3>
            <p>
              Acompañamos a organizaciones en la adopción de procesos y metodologías que fortalecen su operación territorial.
            </p>
          </article>
          <article className="service-card">
            <h3>Talleres para toma de decisiones</h3>
            <p>
              Diseñamos talleres orientados a convertir información territorial en criterios accionables para priorizar estrategias y decisiones.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Capacitacion
