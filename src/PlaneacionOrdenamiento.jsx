import { Link } from 'react-router-dom'
import './App.css'
import { assetPath } from './assetPath'

const planeacionProjectTypes = [
  {
    title: 'Inventarios de Arbolado, Señalización y Luminarias',
    image: assetPath('/planeacion/inventario-puebla-01.png'),
    imageAlt: 'Vista ilustrativa para inventarios urbanos',
    linkTo: '/servicios/proyectos/inventrees-proyectos',
    linkLabel: 'Oferta de Proyectos',
    description:
      'Desarrollamos levantamientos territoriales para registrar, ubicar y evaluar infraestructura urbana clave para su mantenimiento y gestión.',
  },
]

function PlaneacionOrdenamiento() {
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
            <Link to="/servicios/proyectos">Proyectos</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro planeacion-intro">
          <h1>Planeación Urbana y Ordenamiento del Territorio.</h1>
          <p className="hero-text">
            Esta sección concentra proyectos para ordenar el crecimiento urbano, zonificar usos del suelo y fortalecer
            la ocupación equilibrada del territorio con base en evidencia geoespacial.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos soluciones para la planeación urbana y el ordenamiento territorial.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {planeacionProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              {projectType.linkTo ? (
                <Link className="planeacion-project-image-link" to={projectType.linkTo} aria-label={`Abrir ${projectType.title}`}>
                  <img
                    className="planeacion-project-image"
                    src={projectType.image}
                    alt={projectType.imageAlt}
                  />
                </Link>
              ) : (
                <img
                  className="planeacion-project-image"
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

export default PlaneacionOrdenamiento
