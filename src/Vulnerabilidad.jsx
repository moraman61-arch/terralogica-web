import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'
import { assetPath } from './assetPath'

const vulnerabilidadProjectTypes = [
  {
    slug: 'exposicion',
    title: 'Exposición Territorial',
    image: assetPath('/proyectos/18041082.jpg'),
    imageAlt: 'Vista ilustrativa para exposición territorial',
    mediaLabel: 'Exposición y contexto territorial',
    description:
      'Identificamos población, infraestructura, actividades económicas y recursos naturales expuestos ante distintos escenarios de amenaza en el territorio.',
    sectionIntro:
      'Integramos información cartográfica, demográfica y de infraestructura para priorizar zonas donde la exposición representa un riesgo mayor para la población y los activos.',
    solutions: [
      {
        title: 'Población expuesta',
        description:
          'Evaluamos la distribución de la población en relación con zonas de alto riesgo para orientar estrategias de prevención y protección.',
        points: [
          { name: 'Zona metropolitana - Morelia', lat: 19.7, lng: -101.18, popupTitle: 'Población expuesta', popupBody: 'Áreas urbanas con mayor concentración de residentes y servicios críticos.' },
          { name: 'Corredor industrial - Guadalajara', lat: 20.67, lng: -103.35, popupTitle: 'Infraestructura crítica', popupBody: 'Sectores con alta densidad de conectividad y activos esenciales.' },
          { name: 'Litoral - Veracruz', lat: 19.2, lng: -96.13, popupTitle: 'Zona costera', popupBody: 'Comunidades con exposición simultánea a amenazas y actividad económica.' },
        ],
      },
      {
        title: 'Infraestructura y activos',
        description:
          'Reconocemos el valor de la infraestructura vial, energética y social para estimar el impacto potencial por eventos adversos.',
        points: [
          { name: 'Carretera federal - Puebla', lat: 19.04, lng: -98.2, popupTitle: 'Vías de comunicación', popupBody: 'Corredores estratégicos con alta conectividad regional.' },
          { name: 'Centro histórico - Oaxaca', lat: 17.07, lng: -96.72, popupTitle: 'Patrimonio y servicios', popupBody: 'Zonas de alta sensibilidad patrimonial y funcional.' },
          { name: 'Zona hospitalaria - Monterrey', lat: 25.68, lng: -100.32, popupTitle: 'Servicios esenciales', popupBody: 'Equipamiento de respuesta con alta dependencia territorial.' },
        ],
      },
      {
        title: 'Escenarios de impacto',
        description:
          'Modelamos escenarios para entender cómo cambia la exposición cuando interactúan amenazas, condiciones sociales y dinámica territorial.',
        points: [
          { name: 'Cuenca urbana - Tlaxcala', lat: 19.31, lng: -98.24, popupTitle: 'Escenario urbano', popupBody: 'Expansión de riesgo asociado a densificación y ocupación.' },
          { name: 'Zona periurbana - Querétaro', lat: 20.59, lng: -100.39, popupTitle: 'Expansión residencial', popupBody: 'Áreas de crecimiento rápido con mayor exposición acumulada.' },
          { name: 'Valle de Toluca', lat: 19.29, lng: -99.66, popupTitle: 'Interacción territorial', popupBody: 'Puntos donde confluyen usos del suelo, población y servicios.' },
        ],
      },
    ],
  },
  {
    slug: 'sensibilidad',
    title: 'Sensibilidad de Sistemas',
    image: assetPath('/proyectos/Sensibilidad.png'),
    imageAlt: 'Vista ilustrativa para sensibilidad de sistemas',
    mediaLabel: 'Sensibilidad y fragilidad territorial',
    description:
      'Evaluamos las condiciones físicas y socioeconómicas en el sistema territorial que incrementan la susceptibilidad de daño frente a eventos adversos.',
    sectionIntro:
      'Analizamos la fragilidad de los sistemas naturales y sociales para identificar qué elementos del territorio responden con mayor vulnerabilidad ante perturbaciones.',
    solutions: [
      {
        title: 'Fragilidad física',
        description:
          'Revisamos características de suelo, topografía y cobertura para detectar zonas más susceptibles a afectaciones permanentes.',
        points: [
          { name: 'Sierra de las Cruces - Estado de México', lat: 19.2, lng: -99.65, popupTitle: 'Relieve complejo', popupBody: 'Terrenos con mayor sensibilidad a erosión y desestabilización.' },
          { name: 'Llanura costera - Campeche', lat: 18.6, lng: -90.5, popupTitle: 'Suelo saturado', popupBody: 'Áreas con mayor sensibilidad frente a inundaciones y sedimentación.' },
          { name: 'Zona de lomerío - Guanajuato', lat: 20.9, lng: -101.3, popupTitle: 'Pendientes elevadas', popupBody: 'Sectores con riesgo de remoción en masa y pérdida de estabilidad.' },
        ],
      },
      {
        title: 'Condiciones socioeconómicas',
        description:
          'Comparte información de capacidad de respuesta social, acceso a servicios y movilidad para ubicar comunidades más sensibles.',
        points: [
          { name: 'Colonia periférica - Ciudad Juárez', lat: 31.69, lng: -106.42, popupTitle: 'Accesibilidad limitada', popupBody: 'Comunidades con restricciones de movilidad y servicios básicos.' },
          { name: 'Delegación urbana - CDMX', lat: 19.43, lng: -99.13, popupTitle: 'Alta densificación', popupBody: 'Áreas urbanas con mayor presión sobre infraestructura y equipamiento.' },
          { name: 'Comunidad rural - Chiapas', lat: 16.76, lng: -93.11, popupTitle: 'Vulnerabilidad social', popupBody: 'Zonas con menor cobertura de servicios y mayor dependencia externa.' },
        ],
      },
      {
        title: 'Capacidad de adaptación',
        description:
          'Observamos los elementos del territorio que pueden reforzar o debilitar la capacidad de adaptación del sistema frente a presiones continuas.',
        points: [
          { name: 'Bosque urbano - Mérida', lat: 20.97, lng: -89.62, popupTitle: 'Cobertura vegetal', popupBody: 'Áreas de amortiguamiento ambiental y regulación térmica.' },
          { name: 'Reserva natural - Oaxaca', lat: 17.05, lng: -96.72, popupTitle: 'Conectividad ecológica', popupBody: 'Corredores que mantienen servicios ecosistémicos esenciales.' },
          { name: 'Zona agrícola - Sinaloa', lat: 24.8, lng: -107.39, popupTitle: 'Sistema productivo', popupBody: 'Territorios con alta dependencia en infraestructura y abastecimiento.' },
        ],
      },
    ],
  },
  {
    slug: 'respuesta',
    title: 'Capacidad de Respuesta',
    image: assetPath('/proyectos/capacidad de respuesta 01.png'),
    imageAlt: 'Vista ilustrativa para capacidad de respuesta',
    mediaLabel: 'Capacidad de respuesta y resiliencia',
    description:
      'Analizamos recursos institucionales y comunitarios para reducir la vulnerabilidad, mejorar la preparación y recuperación, incrementando la resiliencia.',
    sectionIntro:
      'Ubicamos los recursos y mecanismos de respuesta disponibles para identificar brechas de capacidad y fortalecer la resiliencia territorial.',
    solutions: [
      {
        title: 'Recursos institucionales',
        description:
          'Identificamos centros de operación, brigadas y redes de apoyo para entender la capacidad de gestión frente a emergencias.',
        points: [
          { name: 'Comando de respuesta - Toluca', lat: 19.28, lng: -99.66, popupTitle: 'Centros de coordinación', popupBody: 'Instalaciones con capacidad operativa para respuesta inmediata.' },
          { name: 'Base logística - Monterrey', lat: 25.68, lng: -100.32, popupTitle: 'Logística y abastecimiento', popupBody: 'Puntos de apoyo con capacidad de movilización rápida.' },
          { name: 'Estación de monitoreo - Veracruz', lat: 19.17, lng: -96.13, popupTitle: 'Monitoreo y alerta', popupBody: 'Instalaciones que soportan vigilancia temprana y comunicación.' },
        ],
      },
      {
        title: 'Redes comunitarias',
        description:
          'Evaluamos la organización comunitaria y la articulación social para fortalecer la respuesta local.',
        points: [
          { name: 'Comunidad de alta participación - Puebla', lat: 19.04, lng: -98.2, popupTitle: 'Participación social', popupBody: 'Comunidades con redes locales de apoyo y organización activa.' },
          { name: 'Asociaciones de vecinos - Mérida', lat: 20.97, lng: -89.62, popupTitle: 'Organización vecinal', popupBody: 'Redes locales que facilitan la coordinación y la difusión de información.' },
          { name: 'Centros cívicos - Michoacán', lat: 19.7, lng: -101.18, popupTitle: 'Espacios de articulación', popupBody: 'Instalaciones que favorecen la respuesta comunitaria y la participación.' },
        ],
      },
      {
        title: 'Planificación y recuperación',
        description:
          'Diseñamos rutas de recuperación y protocolos de acción para reducir el tiempo de respuesta y mejorar la continuidad institucional.',
        points: [
          { name: 'Corredor de recuperación - Guadalajara', lat: 20.67, lng: -103.35, popupTitle: 'Recuperación posterior', popupBody: 'Sectores prioritarios para reactivación de servicios y movilidad.' },
          { name: 'Área de reconstrucción - Oaxaca', lat: 17.07, lng: -96.72, popupTitle: 'Reconstrucción', popupBody: 'Zonas donde se prioriza la restitución de infraestructura esencial.' },
          { name: 'Nodo de coordinación - Querétaro', lat: 20.59, lng: -100.39, popupTitle: 'Coordinación interinstitucional', popupBody: 'Espacios de articulación para la continuidad operativa.' },
        ],
      },
    ],
  },
]

function VulnerabilidadMap({ points }) {
  const mapContainerRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]))
      map.fitBounds(bounds, {
        padding: [18, 18],
        maxZoom: 7,
        animate: false,
      })
    } else {
      map.setView([23.6345, -102.5528], 5)
    }

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng]).addTo(map)
      const popupBody = point.popupBody ? `<p>${point.popupBody}</p>` : ''
      marker.bindPopup(`<strong>${point.popupTitle}</strong><br />${popupBody}`)
    })

    return () => {
      map.remove()
    }
  }, [points])

  return <div className="vulnerability-map-shell" ref={mapContainerRef} aria-label="Mapa de referencia" />
}

function Vulnerabilidad() {
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
            <Link to="/servicios/proyectos/gestion-riesgos-proteccion-civil">Gestión de Riesgos</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro planeacion-intro">
          <h1>Vulnerabilidad.</h1>
          <p className="hero-text">
            Esta sección concentra proyectos para evaluar exposición, sensibilidad y capacidades de respuesta con enfoque territorial.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos: Análisis de vulnerabilidad</p>
          <h2>Desarrollamos análisis para comprender y reducir la vulnerabilidad territorial.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {vulnerabilidadProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img className="planeacion-project-image" src={projectType.image} alt={projectType.imageAlt} />
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
          {vulnerabilidadProjectTypes.map((projectType) => (
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
                    <VulnerabilidadMap points={solution.points} />
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

export default Vulnerabilidad