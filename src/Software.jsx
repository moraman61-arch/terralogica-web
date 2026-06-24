import { Link } from 'react-router-dom'
import './App.css'

function Software() {
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
          <h1>Software geoespacial diseñado para apoyar la gestión territorial.</h1>
          <p className="hero-text">
            Creamos soluciones digitales que integran datos, imágenes, mapas y análisis para transformar procesos complejos en flujos operativos claros.
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Soluciones digitales</p>
          <h2>Herramientas para generar datos, monitorear procesos, y visualizar resultados.</h2>
        </div>
        <div className="service-grid">
          <Link to="/servicios/software/inventrees" className="service-link">
            <article className="service-card">
              <h3>Generación y procesamiento de datos</h3>
              <p>
                Implementamos módulos para capturar, depurar y estructurar datos territoriales provenientes de campo, sensores y fuentes institucionales.
              </p>
              <p className="service-card-cta">Ver planes de suscripción de INVENTREES</p>
            </article>
          </Link>
          <article className="service-card">
            <h3>Integración de datos y flujos</h3>
            <p>
              Conectamos información geoespacial con sistemas operativos y de negocio para que el software impulse decisiones reales.
            </p>
          </article>
          <article className="service-card">
            <h3>Plataformas de visualización</h3>
            <p>
              Desarrollamos interfaces que muestran el territorio, indicadores y riesgos en mapas interactivos y tableros ejecutivos.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Software
