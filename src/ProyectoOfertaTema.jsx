import { Link, useParams } from 'react-router-dom'
import './App.css'
import { assetPath } from './assetPath'
import { proyectoTemas } from './proyectoTemasData'

function ProyectoOfertaTema() {
  const { temaSlug } = useParams()
  const projectTopic = proyectoTemas.find((topic) => topic.slug === temaSlug)

  if (!projectTopic) {
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
            <h1>Oferta de Proyectos</h1>
            <p className="hero-text">No encontramos la subpágina solicitada.</p>
          </div>
        </section>
      </main>
    )
  }

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
          <h1>{projectTopic.title}</h1>
          <p className="hero-text">Conozca nuestra oferta de proyectos para {projectTopic.title.toLowerCase()}.</p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Oferta de Proyectos</p>
          <h2>{projectTopic.title}</h2>
        </div>
        {projectTopic.showMainCard !== false ? (
          <article className="service-card project-card planeacion-project-card">
            <img className="planeacion-project-image" src={assetPath(projectTopic.imagePath)} alt={projectTopic.imageAlt} />
            <p>{projectTopic.description}</p>
            <Link className="service-card-cta project-panel-link" to="/servicios/proyectos">
              Volver a Proyectos
            </Link>
          </article>
        ) : (
          <Link className="service-card-cta project-panel-link" to="/servicios/proyectos">
            Volver a Proyectos
          </Link>
        )}

        {projectTopic.relatedPanels?.length ? (
          <div className="service-grid projects-grid planeacion-projects-grid">
            {projectTopic.relatedPanels.map((panel) => (
              <article key={panel.title} className="service-card project-card planeacion-project-card">
                {panel.linkTo ? (
                  <Link className="planeacion-project-image-link" to={panel.linkTo} aria-label={`Abrir ${panel.title}`}>
                    <img className="planeacion-project-image" src={assetPath(panel.imagePath)} alt={panel.imageAlt} />
                  </Link>
                ) : (
                  <img className="planeacion-project-image" src={assetPath(panel.imagePath)} alt={panel.imageAlt} />
                )}
                <h3>{panel.title}</h3>
                <p>{panel.description}</p>
                {panel.linkTo ? (
                  <Link className="service-card-cta project-panel-link" to={panel.linkTo}>
                    {panel.linkLabel ?? 'Ver más'}
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default ProyectoOfertaTema