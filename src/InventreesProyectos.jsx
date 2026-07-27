import { Link } from 'react-router-dom'
import './App.css'

const inventreesProjectTypes = [
  {
    slug: 'arbolado-publico',
    title: 'Arbolado público',
    image: '/inventrees/inventario-arbolado-publico.png',
    videoSrc: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/ddfc59de0af6f73381bd7eeaf489ea0b/manifest/video.m3u8',
    imageAlt: 'Imagen de referencia para inventario de arbolado publico',
    mediaLabel: 'Inventario y gestión de arbolado urbano.',
    description:
      'Levantamiento y organización del arbolado urbano que se encuentra en los espacios públicos de la ciudad. El inventario registra la geolocalización, medición y caracterización de cada árbol, así como la generación de reportes y mapas por unidad administrativa / funcional de la ciudad para la gestión del arbolado urbano.',
    sectionIntro:
      'Integramos geolocalización, medición y caracterización del arbolado en los espacios públicos para construir inventarios de arbolado útiles para mantenimiento, diagnóstico de riesgo y planeación operativa.',
    solutions: [
      {
        title: 'Registro georreferenciado de ejemplares',
        description:
          'Ubicamos cada árbol en imágenes de nivel de calle y consolidamos una base espacial para consulta, actualización y seguimiento por colonia, vialidad o parque.',
      },
      {
        title: 'Medición y caracterización del arbolado',
        description:
          'Documentamos especie, dimensiones, condición física e interferencias para apoyar decisiones de poda, sustitución y conservación.',
      },
      {
        title: 'Reportes y mapas para gestión urbana',
        description:
          'Generamos tableros, mapas temáticos y reportes ejecutivos para priorizar atención, presupuesto y acciones de mantenimiento.',
      },
    ],
  },
  {
    slug: 'senalizacion-de-calle',
    title: 'Señalización de calle',
    image: '/inventrees/inventario-senalizacion-calle.png',
    imageAlt: 'Imagen de referencia para inventario de senalizacion urbana',
    mediaLabel: 'Inventario de señalética y seguridad vial.',
    description:
      'La signaléctica urbana requiere un sistema de inventario que ayude a garantizar la seguridad y eficiencia del tránsito, y a orientar, guiar e informar adecuadamente a los ciudadanos y visitantes de la ciudad. El inventario contiene la ubicación, características y condición de las señales verticales en los espacios públicos de la ciudad.',
    sectionIntro:
      'Desarrollamos inventarios de señalización para ordenar activos, detectar faltantes, evaluar condición y fortalecer programas de seguridad vial y movilidad urbana.',
    solutions: [
      {
        title: 'Levantamiento de señales verticales',
        description:
          'Registramos ubicación, tipología, contenido y soporte de cada señal para construir un padrón confiable de activos en vía pública.',
      },
      {
        title: 'Evaluación de estado y visibilidad',
        description:
          'Identificamos señales dañadas, obstruidas o fuera de norma para priorizar reposición, limpieza y mejora de legibilidad.',
      },
      {
        title: 'Planeación de reposición y cobertura',
        description:
          'Entregamos mapas y listados operativos para cerrar vacíos de cobertura y programar mantenimiento por corredor o zona urbana.',
      },
    ],
  },
  {
    slug: 'luminarias-y-postes',
    title: 'Luminarias y postes',
    image: '/inventrees/inventario-luminarias-postes.png',
    imageAlt: 'Imagen de referencia para inventario de luminarias y postes',
    mediaLabel: 'Infraestructura de alumbrado y soporte urbano.',
    description:
      'La presencia de postes que soportan funciones de utilidad para diversos servicios en la ciudad, como la iluminación de espacios públicos o el tendido de cables y montaje de cámaras de vigilancia, requiere una gestión  con base en un inventario que brinde información sobre su ubicación, función, y estado físico y funcional.',
    sectionIntro:
      'Levantamos y estructuramos inventarios de luminarias y postes para mejorar control patrimonial, mantenimiento preventivo y evaluación de cobertura de servicios urbanos.',
    solutions: [
      {
        title: 'Inventario de postes y luminarias',
        description:
          'Registramos ubicación, tipo de poste, brazo, luminaria y función asociada para consolidar la infraestructura existente en un solo sistema.',
      },
      {
        title: 'Diagnóstico físico y funcional',
        description:
          'Evaluamos condición estructural, operación y compatibilidad del activo para detectar riesgos, fallas y necesidades de intervención.',
      },
      {
        title: 'Mapeo de cobertura y prioridades',
        description:
          'Construimos mapas para analizar cobertura, zonas críticas y prioridades de mantenimiento o ampliación del servicio.',
      },
    ],
  },
]

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
          {inventreesProjectTypes.map((projectType) => (
            <article key={projectType.slug} className="identity-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img
                  className="inventrees-panel-image"
                  src={projectType.image}
                  alt={projectType.imageAlt}
                  loading="lazy"
                />
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
          {inventreesProjectTypes.map((projectType) => (
            <article key={projectType.slug} id={projectType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img
                    className="amenazas-media-image"
                    src={projectType.image}
                    alt=""
                    loading="lazy"
                  />
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

              {projectType.videoSrc ? (
                <div className="inventrees-section-video-block">
                  <video
                    className="inventrees-section-video"
                    src={projectType.videoSrc}
                    controls
                    preload="metadata"
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default InventreesProyectos