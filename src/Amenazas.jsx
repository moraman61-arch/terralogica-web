import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const amenazasProjectTypes = [
  {
    slug: 'geologicas',
    title: 'Geológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas geológicas',
    mediaLabel: 'Imagen animada | monitoreo geológico continuo',
    description:
      'Analizamos amenazas asociadas a procesos geológicos como deslizamientos, fallamientos y fenómenos de inestabilidad del terreno.',
    sectionIntro:
      'Consolidamos información de campo, antecedentes y análisis espacial para identificar zonas críticas y definir prioridades de intervención.',
    solutions: [
      {
        title: 'Estudios de deslizamientos de tierra',
        description:
          'Caracterizamos laderas, detonantes y patrones de ocurrencia para delimitar zonas de amenaza por movimientos en masa.',
        points: [
          { name: 'Ladera Oriente - Monterrey', x: 24, y: 33 },
          { name: 'Corredor serrano - Hidalgo', x: 49, y: 26 },
          { name: 'Cuenca alta - Puebla', x: 69, y: 41 },
        ],
      },
      {
        title: 'Detección y análisis de fallas geológicas',
        description:
          'Integramos cartografía geológica y fotointerpretación para localizar estructuras activas y evaluar su posible influencia territorial.',
        points: [
          { name: 'Franja estructural - Sonora', x: 20, y: 52 },
          { name: 'Sistema de fallas - Querétaro', x: 54, y: 48 },
          { name: 'Bloque tectónico - Oaxaca', x: 78, y: 61 },
        ],
      },
      {
        title: 'Evaluación de inestabilidad en áreas urbanas',
        description:
          'Evaluamos taludes urbanos y zonas de expansión para orientar medidas de estabilización y gestión preventiva.',
        points: [
          { name: 'Zona de taludes - Tijuana', x: 14, y: 22 },
          { name: 'Periferia urbana - Guadalajara', x: 44, y: 50 },
          { name: 'Borde urbano - Morelia', x: 62, y: 56 },
        ],
      },
    ],
  },
  {
    slug: 'hidrometeorologicas',
    title: 'Hidrometeorológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas hidrometeorológicas',
    mediaLabel: 'Imagen animada | escenarios de lluvia y escurrimiento',
    description:
      'Evaluamos amenazas ligadas a lluvias extremas, inundaciones, ciclones, sequías y otros eventos atmosféricos con impacto territorial.',
    sectionIntro:
      'Desarrollamos escenarios por evento y temporada para apoyar decisiones de prevención, protección civil y planificación territorial.',
    solutions: [
      {
        title: 'Modelación de inundaciones urbanas',
        description:
          'Simulamos niveles de agua y zonas anegables para priorizar obras de drenaje, protocolos de alerta y rutas seguras.',
        points: [
          { name: 'Cuenca urbana - Villahermosa', x: 76, y: 68 },
          { name: 'Planicie aluvial - Veracruz', x: 72, y: 49 },
          { name: 'Valle bajo - Culiacán', x: 26, y: 41 },
        ],
      },
      {
        title: 'Análisis de sequía y estrés hídrico',
        description:
          'Identificamos patrones de déficit de precipitación y disponibilidad de agua para fortalecer la gestión hídrica regional.',
        points: [
          { name: 'Región semidesértica - Coahuila', x: 34, y: 24 },
          { name: 'Zona agrícola - Zacatecas', x: 43, y: 37 },
          { name: 'Bajío - Guanajuato', x: 53, y: 45 },
        ],
      },
      {
        title: 'Mapeo de exposición por ciclones',
        description:
          'Estimamos exposición de población e infraestructura frente a trayectorias ciclónicas para mejorar medidas de preparación.',
        points: [
          { name: 'Litoral - Quintana Roo', x: 88, y: 58 },
          { name: 'Costa del Golfo - Tamaulipas', x: 67, y: 31 },
          { name: 'Costa del Pacífico - Guerrero', x: 60, y: 72 },
        ],
      },
    ],
  },
  {
    slug: 'biologicas',
    title: 'Biológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas biológicas',
    mediaLabel: 'Imagen animada | vigilancia territorial de riesgos biológicos',
    description:
      'Desarrollamos análisis espaciales para reconocer riesgos de origen biológico y apoyar estrategias de vigilancia, prevención y respuesta.',
    sectionIntro:
      'Integramos información epidemiológica, ambiental y demográfica para focalizar acciones de salud pública y control sanitario.',
    solutions: [
      {
        title: 'Vigilancia geoespacial de vectores',
        description:
          'Ubicamos zonas de mayor probabilidad de presencia de vectores para optimizar brigadas y campañas de control.',
        points: [
          { name: 'Zona periurbana - Mérida', x: 86, y: 54 },
          { name: 'Corredor costero - Chiapas', x: 79, y: 77 },
          { name: 'Área metropolitana - Acapulco', x: 58, y: 70 },
        ],
      },
      {
        title: 'Análisis territorial de brotes',
        description:
          'Detectamos patrones espaciales y temporales de brotes para priorizar cercos sanitarios y acciones de contención.',
        points: [
          { name: 'Núcleo urbano - CDMX', x: 58, y: 52 },
          { name: 'Conurbación - Puebla', x: 67, y: 54 },
          { name: 'Valle central - Oaxaca', x: 70, y: 66 },
        ],
      },
      {
        title: 'Priorización de intervención sanitaria',
        description:
          'Combinamos indicadores de riesgo para definir zonas críticas de intervención y seguimiento operativo.',
        points: [
          { name: 'Municipio prioritario - Tabasco', x: 78, y: 65 },
          { name: 'Nodo logístico - Jalisco', x: 45, y: 50 },
          { name: 'Franja fronteriza - Chihuahua', x: 32, y: 20 },
        ],
      },
    ],
  },
]

const mexicoBounds = [
  [14.3, -118.5],
  [33.2, -86.2],
]

const demoMarkers = [
  {
    id: 'oaxaca',
    name: 'Oaxaca',
    lat: 17.07,
    lng: -97.68,
    popupHtml: `
      <div class="amenazas-popup-content">
        <h5>Deslizamiento en la Carretera a San Juan Teposcolula, Oax.</h5>
        <model-viewer
          src="/amenazas/modelo-teposcolula-3d.webopt.glb"
          camera-controls
          touch-action="pan-y"
          ar
          loading="lazy"
          reveal="interaction"
          style="width: 100%; height: 220px; border-radius: 8px; background: #081b46;"
        ></model-viewer>
      </div>
    `,
  },
  {
    id: 'guerrero',
    name: 'Guerrero',
    lat: 17.44,
    lng: -99.52,
    popupHtml: `
      <div class="amenazas-popup-content">
        <h5>Punto ficticio de proyecto en Guerrero</h5>
        <p>Ubicación de demostración para futuras fichas de proyectos geológicos.</p>
      </div>
    `,
  },
  {
    id: 'michoacan',
    name: 'Michoacán',
    lat: 19.70,
    lng: -101.18,
    popupHtml: `
      <div class="amenazas-popup-content">
        <h5>Punto ficticio de proyecto en Michoacán</h5>
        <p>Ubicación de demostración para futuras fichas de proyectos geológicos.</p>
      </div>
    `,
  },
]

function ThreatProjectMap({ title }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 4,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    map.fitBounds(mexicoBounds)

    demoMarkers.forEach((markerData) => {
      L.circleMarker([markerData.lat, markerData.lng], {
        radius: 7,
        color: '#07193f',
        weight: 1.5,
        fillColor: '#2fd072',
        fillOpacity: 0.95,
      })
        .addTo(map)
        .bindPopup(markerData.popupHtml, { maxWidth: 420 })
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <figure className="amenazas-mini-map" aria-label={`Mapa de proyectos para ${title}`}>
      <div ref={mapContainerRef} className="amenazas-leaflet-map" />
      <figcaption>Extensión inicial: México | Puntos ficticios: Oaxaca, Guerrero y Michoacán.</figcaption>
    </figure>
  )
}

function Amenazas() {
  useEffect(() => {
    const existingScript = document.querySelector('script[data-model-viewer="true"]')

    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
    script.setAttribute('data-model-viewer', 'true')
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

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
          <h1>Amenazas.</h1>
          <p className="hero-text">
            Esta sección concentra proyectos para analizar distintos tipos de amenazas y generar evidencia que fortalezca la gestión del riesgo.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos</p>
          <h2>Desarrollamos análisis de amenazas geológicas, hidrometeorológicas y biológicas.</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {amenazasProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img
                  className="planeacion-project-image"
                  src={projectType.image}
                  alt={projectType.imageAlt}
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
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Soluciones que ofrecemos</p>
          <h2>Cada línea de amenaza integra análisis técnico, evidencia territorial y experiencia en campo.</h2>
        </div>

        <div className="amenazas-sections-grid">
          {amenazasProjectTypes.map((threatType) => (
            <article key={threatType.slug} id={threatType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img className="amenazas-media-image" src={threatType.image} alt="" loading="lazy" />
                  <div className="amenazas-media-overlay" />
                  <p className="amenazas-media-kicker">{threatType.mediaLabel}</p>
                </div>
                <div className="amenaza-section-copy">
                  <p className="eyebrow">Sección {threatType.title}</p>
                  <h3>{threatType.title}</h3>
                  <p>{threatType.sectionIntro}</p>
                </div>
              </header>

              <div className="amenaza-solutions-grid">
                {threatType.solutions.map((solution) => (
                  <article key={solution.title} className="amenaza-solution-card">
                    <h4>{solution.title}</h4>
                    <p>{solution.description}</p>
                    <ThreatProjectMap title={solution.title} />
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

export default Amenazas