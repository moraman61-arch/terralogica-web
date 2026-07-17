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
            Hace diez años desarrollamos una metodología para la gestión de inventarios urbanos que emplea imágenes de nivel de calle.
            <br />
            La llamamos INVENTREES (/ˈɪn.vənˌtɔːr.iːz/ = inventories = inventarios).
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">INVENTREES</p>
          <h2>¿Qué inventario necesita?</h2>
          <p className="inventrees-intro-note">
            Los inventarios de activos urbanos son indispensables para las operaciones de manejo, mantenimiento y
            planificación requeridas para administrar adecuadamente los servicios que brindan a la ciudadanía.
          </p>
        </div>
        <div className="identity-grid inventrees-panels-grid">
          <article className="identity-card">
            <img
              className="inventrees-panel-image"
              src="/inventrees/inventario-arbolado-publico.png"
              alt="Imagen de referencia para inventario de arbolado publico"
              loading="lazy"
            />
            <h3>Arbolado público</h3>
            <p>
              Levantamiento y organización del arbolado urbano que se encuentra en los espacios públicos de la ciudad. El inventario registra la geolocalización, medición y caracterización de cada árbol, así como la generación de reportes y mapas por unidad administrativa / funcional de la ciudad para la gestión del arbolado urbano. 
            </p>
          </article>
          <article className="identity-card">
            <img
              className="inventrees-panel-image"
              src="/inventrees/inventario-senalizacion-calle.png"
              alt="Imagen de referencia para inventario de senalizacion urbana"
              loading="lazy"
            />
            <h3>Señalización de calle</h3>
            <p>
              La signaléctica urbana requiere un sistema de inventario que ayude a garantizar la seguridad y eficiencia del tránsito, y a orientar, guiar e informar adecuadamente a los ciudadanos y visitantes de la ciudad. El inventario contiene la ubicación, características y condición de las señales verticales en los espacios públicos de la ciudad.
            </p>
          </article>
          <article className="identity-card">
            <img
              className="inventrees-panel-image"
              src="/inventrees/inventario-luminarias-postes.png"
              alt="Imagen de referencia para inventario de luminarias y postes"
              loading="lazy"
            />
            <h3>Luminarias y postes</h3>
            <p>
              La presencia de postes que soportan funciones de utilidad para diversos servicios en la ciudad, como la iluminación de espacios públicos o el tendido de cables y montaje de cámaras de vigilancia, requiere una gestión  con base en un inventario que brinde información sobre su ubicación, función, y estado físico y funcional.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default InventreesProyectos