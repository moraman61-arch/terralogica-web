import { Link } from 'react-router-dom'
import './App.css'

function InventreesProyectos() {
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
            <Link to="/servicios/proyectos">Proyectos</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro planeacion-intro">
          <h1>
            INVENTREES
          </h1>
          <p className="hero-text">
            Hace diez años desarrollamos una metodología para la gestión de inventarios urbanos, que emplea imágenes de nivel de calle.
            <br />
            La llamamos INVENTREES.
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">INVENTREES</p>
          <h2>¿qué inventario necesita?</h2>
        </div>
        <div className="identity-grid inventrees-panels-grid">
          <article className="identity-card">
            <h3>Arbolado Público</h3>
            <p>
              Levantamiento y estructuración de activos urbanos, arbolado, señalización, luminarias y otros elementos
              relevantes para la planeación.
            </p>
          </article>
          <article className="identity-card">
            <h3>Señalización de calle</h3>
            <p>
              Procesamos información territorial para generar insumos claros de consulta, priorización y toma de
              decisiones.
            </p>
          </article>
          <article className="identity-card">
            <h3>Luminarias y postes</h3>
            <p>
              Mantenemos la información al día para reflejar cambios urbanos, nuevas evidencias de campo y necesidades
              operativas de seguimiento.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default InventreesProyectos