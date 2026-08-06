import { Link } from 'react-router-dom'
import './App.css'
import { assetPath } from './assetPath'

const contaminacionProjectTypes = [
  {
    slug: 'calidad-del-aire',
    title: 'Calidad del Aire',
    image: assetPath('/proyectos/unnamed-15.jpg'),
    imageAlt: 'Imagen de referencia para proyectos de calidad del aire',
    mediaLabel: 'Monitoreo de calidad del aire.',
    description:
      'Diseñamos proyectos para medir, mapear y analizar la calidad del aire con evidencia territorial para apoyar decisiones de salud pública.',
    sectionIntro:
      'Integramos sensores, datos geoespaciales y análisis técnico para evaluar la distribución de contaminantes, identificar focos críticos y definir estrategias de mitigación.',
    solutions: [
      {
        title: 'Monitoreo espacial de contaminantes',
        description:
          'Diseñamos redes de monitoreo y campañas móviles para medir concentraciones de contaminantes atmosféricos en zonas urbanas y periurbanas.',
      },
      {
        title: 'Modelación y diagnóstico de exposición',
        description:
          'Aplicamos análisis espacial y modelación para identificar patrones de exposición y su relación con condiciones de riesgo para la población.',
      },
      {
        title: 'Priorización de acciones de mitigación',
        description:
          'Generamos criterios territoriales para orientar medidas de control, vigilancia y comunicación del riesgo en áreas de mayor impacto.',
      },
    ],
  },
  {
    slug: 'evaluacion-sitios-residuos-solidos',
    title: 'Evaluación y Selección de Sitios para el Manejo de Residuos Sólidos',
    image: assetPath('/proyectos/Mapa.png'),
    imageAlt: 'Imagen de referencia para evaluación de sitios de residuos sólidos',
    mediaLabel: 'Evaluación de sitios para manejo de residuos sólidos.',
    description:
      'Evaluamos y seleccionamos sitios para manejo de residuos sólidos con criterios técnicos, ambientales y territoriales.',
    sectionIntro:
      'Desarrollamos análisis multicriterio para localizar alternativas viables, reducir impactos ambientales y fortalecer la planeación de infraestructura para residuos sólidos.',
    solutions: [
      {
        title: 'Análisis multicriterio territorial',
        description:
          'Combinamos variables ambientales, geológicas, hidrológicas, de accesibilidad y uso del suelo para identificar zonas aptas para la infraestructura.',
      },
      {
        title: 'Evaluación de restricciones y riesgos',
        description:
          'Delimitamos zonas de exclusión y riesgo para evitar afectaciones a población, ecosistemas e infraestructura estratégica.',
      },
      {
        title: 'Comparación y jerarquización de alternativas',
        description:
          'Priorizamos sitios potenciales con indicadores de viabilidad técnica y territorial para apoyar la toma de decisiones.',
      },
    ],
  },
]

function ContaminacionAmbiental() {
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
            <Link to="/servicios/proyectos/oferta/medio-ambiente-recursos-naturales">Medio Ambiente</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro planeacion-intro">
          <h1>Contaminación Ambiental y Salud Pública.</h1>
          <p className="hero-text">
            Esta sección presenta nuestra oferta de proyectos para evaluar calidad del aire y seleccionar sitios para
            el manejo de residuos sólidos con enfoque territorial.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos soluciones para diagnóstico ambiental y soporte a decisiones públicas.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {contaminacionProjectTypes.map((projectType) => (
            <article key={projectType.slug} className="service-card project-card planeacion-project-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img className="planeacion-project-image" src={projectType.image} alt={projectType.imageAlt} loading="lazy" />
              </a>
              <h3>{projectType.title}</h3>
              <p>{projectType.description}</p>
              <a className="service-card-cta project-panel-link" href={`#${projectType.slug}`}>
                {projectType.title}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section amenazas-detail-stack">
        <div className="amenazas-sections-grid">
          {contaminacionProjectTypes.map((projectType) => (
            <article key={projectType.slug} id={projectType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img className="amenazas-media-image" src={projectType.image} alt="" loading="lazy" />
                  <div className="amenazas-media-overlay" />
                  <p className="amenazas-media-kicker">{projectType.mediaLabel}</p>
                </div>
                <div className="amenaza-section-copy">
                  <p className="eyebrow">Sección {projectType.title}</p>
                  <h3>{projectType.title}</h3>
                  <p>{projectType.sectionIntro}</p>
                </div>
              </header>

              <div className="amenaza-solutions-grid">
                {projectType.solutions.map((solution) => (
                  <article key={solution.title} className="amenaza-solution-card">
                    <h4>{solution.title}</h4>
                    <p>{solution.description}</p>
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ContaminacionAmbiental
