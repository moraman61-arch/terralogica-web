import { Link } from 'react-router-dom'
import './App.css'

const riesgosProjectTypes = [
  {
    title: 'Identificación de Riesgos',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para identificación de riesgos',
    description:
      'Delimitamos escenarios de riesgo mediante la integración espacial de amenazas, exposición y vulnerabilidad en distintos contextos territoriales.',
  },
  {
    title: 'Evaluación y Priorización',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para evaluación y priorización de riesgos',
    description:
      'Valoramos impactos potenciales para priorizar zonas, sectores e infraestructuras que requieren acciones preventivas inmediatas.',
  },
  {
    title: 'Mitigación y Gestión',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para mitigación y gestión de riesgos',
    description:
      'Diseñamos estrategias de mitigación, preparación y seguimiento para reducir pérdidas y fortalecer la resiliencia territorial.',
  },
]

function Riesgos() {
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
            <Link to="/servicios/proyectos/gestion-riesgos-proteccion-civil">Gestión de Riesgos</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro planeacion-intro">
          <h1>Riesgos.</h1>
          <p className="hero-text">
            Esta sección presenta proyectos para identificar, evaluar y gestionar riesgos con base en evidencia geoespacial.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos soluciones integrales para la evaluación y gestión territorial de riesgos.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {riesgosProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              <img
                className="planeacion-project-image"
                src={projectType.image}
                alt={projectType.imageAlt}
              />
              <h3>{projectType.title}</h3>
              <p>{projectType.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Riesgos