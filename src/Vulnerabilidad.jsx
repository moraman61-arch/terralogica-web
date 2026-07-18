import { Link } from 'react-router-dom'
import './App.css'

const vulnerabilidadProjectTypes = [
  {
    title: 'Exposición Territorial',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para exposición territorial',
    description:
      'Identificamos población, infraestructura y activos estratégicos expuestos ante distintos escenarios de amenaza en el territorio.',
  },
  {
    title: 'Fragilidad de Sistemas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para fragilidad de sistemas',
    description:
      'Evaluamos condiciones físicas, sociales y funcionales que incrementan la susceptibilidad de daño frente a eventos adversos.',
  },
  {
    title: 'Capacidad de Respuesta',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para capacidad de respuesta',
    description:
      'Analizamos recursos institucionales y comunitarios para reducir vulnerabilidad y mejorar la preparación y recuperación.',
  },
]

function Vulnerabilidad() {
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
          <h1>Vulnerabilidad.</h1>
          <p className="hero-text">
            Esta sección concentra proyectos para analizar exposición, fragilidad y capacidades de respuesta con enfoque territorial.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos análisis para comprender y reducir la vulnerabilidad territorial.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {vulnerabilidadProjectTypes.map((projectType) => (
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

export default Vulnerabilidad