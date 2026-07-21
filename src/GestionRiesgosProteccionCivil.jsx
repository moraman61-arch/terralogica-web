import { Link } from 'react-router-dom'
import './App.css'

const riskProjectTypes = [
  {
    title: 'Análisis de Amenazas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para análisis de amenazas',
    linkTo: '/servicios/proyectos/gestion-riesgos-proteccion-civil/amenazas',
    linkLabel: 'Oferta de Proyectos',
    description:
      'Evaluamos amenazas naturales y de origen humano para identificar su distribución espacial, intensidad, factores detonantes y posibles afectaciones sobre el territorio.',
  },
  {
    title: 'Análisis de Vulnerabilidad',
    image: '/proyectos/VULNELOCMOR.png?v=20260720',
    imageClass: 'planeacion-project-image-vulnerabilidad',
    imageAlt: 'Vista ilustrativa para análisis de vulnerabilidad',
    linkTo: '/servicios/proyectos/gestion-riesgos-proteccion-civil/vulnerabilidad',
    linkLabel: 'Oferta de Proyectos',
    description:
      'Estudiamos exposición, fragilidad y capacidades de respuesta para reconocer qué sectores, poblaciones e infraestructuras presentan mayor vulnerabilidad.',
  },
  {
    title: 'Gestión Integral del Riesgo',
    image: '/proyectos/GestionIntegralRiesgo02.png?v=20260720',
    imageAlt: 'Vista ilustrativa para gestión integral de riesgos',
    linkTo: '/servicios/proyectos/gestion-riesgos-proteccion-civil/riesgos',
    linkLabel: 'Oferta de Proyectos',
    description:
      'Diseñamos proyectos que articulan prevención, preparación, mitigación y respuesta con base en evidencia geoespacial para fortalecer la protección civil.',
  },
]

function GestionRiesgosProteccionCivil() {
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
          <h1>Gestión de Riesgos y Protección Civil</h1>
          <p className="hero-text">
            Conozca nuestra oferta de proyectos para analizar amenazas, vulnerabilidad y riesgo.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos soluciones para la gestión de riesgos y la protección civil</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {riskProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              {projectType.linkTo ? (
                <Link className="planeacion-project-image-link" to={projectType.linkTo} aria-label={`Abrir ${projectType.title}`}>
                  <img
                    className={`planeacion-project-image${projectType.imageClass ? ` ${projectType.imageClass}` : ''}`}
                    src={projectType.image}
                    alt={projectType.imageAlt}
                  />
                </Link>
              ) : (
                <img
                  className={`planeacion-project-image${projectType.imageClass ? ` ${projectType.imageClass}` : ''}`}
                  src={projectType.image}
                  alt={projectType.imageAlt}
                />
              )}
              <h3>{projectType.title}</h3>
              <p>{projectType.description}</p>
              {projectType.linkTo ? (
                <Link className="service-card-cta project-panel-link" to={projectType.linkTo}>
                  {projectType.linkLabel}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default GestionRiesgosProteccionCivil