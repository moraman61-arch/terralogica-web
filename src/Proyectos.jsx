import { Link } from 'react-router-dom'
import './App.css'
import { assetPath } from './assetPath'
import { proyectoTemas } from './proyectoTemasData'

const projectServices = proyectoTemas.map((topic) => ({
  ...topic,
  linkTo: topic.linkTo ?? `/servicios/proyectos/oferta/${topic.slug}`,
  image: assetPath(topic.imagePath),
  linkLabel: 'Oferta de Proyectos',
}))

function Proyectos() {
  return (
    <main className="page-shell subpage-shell">
      <section className="hero-section subpage-hero">
        <header className="topbar">
          <Link className="brand" to="/" aria-label="Volver al inicio de Terralógica">
            <img className="brand-logo" src={assetPath('/terralogics-imago.png')} alt="Imago de Terralógica" />
            <span className="brand-text">Terralógica</span>
          </Link>
          <nav className="topnav" aria-label="Navegación secundaria">
            <Link to="/">Inicio</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro">
          <h1>Diseñamos y desarrollamos proyectos con inteligencia humana y artificial para una mejor gestión territorial
            .</h1>
          <p className="hero-text">
            Ofrecemos soluciones de análisis, modelado y monitoreo para proyectos que requieren una visión integral del territorio.
          </p>
        </div>
      </section>

      <section className="services-section projects-services-section">
        <div className="section-heading">
          <p className="eyebrow">Lo que hacemos</p>
        </div>
        <div className="service-grid projects-grid">
          {projectServices.map((item) => (
            <article key={item.title} className="service-card project-card">
              {item.linkTo ? (
                <Link className="planeacion-project-image-link" to={item.linkTo} aria-label={`Abrir ${item.title}`}>
                  <img
                    className={`project-card-image${item.imageClass ? ` ${item.imageClass}` : ''}`}
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                  />
                </Link>
              ) : (
                <img
                  className={`project-card-image${item.imageClass ? ` ${item.imageClass}` : ''}`}
                  src={item.image}
                    alt={item.imageAlt}
                  loading="lazy"
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="service-card-cta project-panel-link" to={item.linkTo}>
                {item.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Proyectos
