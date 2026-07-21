import './App.css'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { assetPath } from './assetPath'



const pillars = [
  {
    title: 'Ciencia',
    description:
      'Nuestras soluciones parten de teorías y metodologías del conocimiento geocientífico aplicado durante más de 40 años.',
  },
  {
    title: 'Técnica',
    description:
      'Empleamos técnicas avanzadas de análisis espacial y visualización para convertir datos en información geográfica accionable.',
  },
  {
    title: 'Tecnología',
    description:
      'Usamos SIG, drones, imágenes satelitales, sensores especializados, trabajo de campo e IA, para generar los datos que se necesitan.',
  },
]

const metrics = [
    { value: 'Proyectos', slug: 'proyectos', label: '' },
    { value: 'Capacitación', slug: 'capacitacion', label: '' },
    { value: 'Software', slug: 'software', label: '' },
]

const roadmap = [
  {
    step: '01',
    title: 'Datos',
    description: 'Usamos tecnologías de vanguardia y trabajo de campo para recopilar y generar DATOS precisos y relevantes del territorio de interés.',
  },
  {
    step: '02',
    title: 'Información',
    description: 'Empleamos técnicas avanzadas de procesamiento y análisis para transformar los datos en INFORMACIÓN útil.',
  },
  {
    step: '03',
    title: 'Conocimiento',
    description: 'Utilizamos CONOCIMIENTO de frontera e innovación para convertir la información en decisiones ejecutables en el territorio.',
  },
]

const heroBannerParts = [
  {
    text: 'Ciencia de Frontera',
    image: assetPath('/banners/ciencia-frontera-real.png'),
  },
  {
    text: 'Técnica Avanzada',
    image: assetPath('/banners/tecnica-avanzada-real.png?v=2'),
  },
  {
    text: 'Tecnología de Vanguardia',
    image: assetPath('/banners/tecnologia-punta-real.png'),
  },
  {
    text: '... esto es Terralógica ...',
    image: assetPath('/banners/terralogics-ai.jpg'),
    videoHls:
      'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/c6e07bb41ae37e52b6c2ef6b76fe39a2/manifest/video.m3u8',
  },
]

const clientTypes = [
  {
    id: 'gobiernos',
    label: 'Gobiernos',
    description: 'Apoyamos gobiernos locales, estatales y nacionales en decisiones de gestión territorial, ordenamiento, riesgos y vulnerabilidad, inversión pública y evaluación de políticas con información geoespacial de calidad.',
  },
  {
    id: 'empresas',
    label: 'Empresas',
    description: 'Brindamos soluciones para empresas de actividades extractivas, infraestructura, logística y servicios, que requieren optimizar operaciones territoriales, gestionar riesgos ambientales y cumplir regulaciones.',
  },
  {
    id: 'organizaciones',
    label: 'Organizaciones',
    description: 'Capacitamos y acompañamos ONG, instituciones académicas y centros de investigación en análisis territorial, monitoreo ambiental y documentación de dinámicas del territorio.',
  },
  {
    id: 'comunidades',
    label: 'Comunidades',
    description: 'Trabajamos con comunidades y actores locales para fortalecer su voz en decisiones sobre el territorio, ofreciendo herramientas y capacidades para análisis y gestión participativa.',
  },
]

function App() {
  const [hoveredClient, setHoveredClient] = useState(null)
  const heroVideoRefs = useRef([])

  useEffect(() => {
    const hlsInstances = []

    heroVideoRefs.current.forEach((videoElement) => {
      if (!videoElement) {
        return
      }

      const sourceUrl = videoElement.dataset.src
      if (!sourceUrl) {
        return
      }

      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = sourceUrl
      } else if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(sourceUrl)
        hls.attachMedia(videoElement)
        hlsInstances.push(hls)
      } else {
        videoElement.src = sourceUrl
      }

      videoElement.play().catch(() => {})
    })

    return () => {
      hlsInstances.forEach((hls) => hls.destroy())
    }
  }, [])

  return (
    <main className="page-shell">
      <section className="hero-section">
        <header className="topbar">
          <a className="brand" href="#inicio" aria-label="Ir al inicio de Terralógica">
            <img className="brand-logo" src={assetPath('/terralogics-imago.png')} alt="Imago de Terralógica" />
            <span className="brand-text">Terralógica</span>
          </a>
          <nav className="topnav" aria-label="Secciones principales">
            <Link to="/quienes-somos">Quiénes somos</Link>
            <a href="#que-hacemos">Qué hacemos</a>
            <a href="#metodologia">Cómo lo hacemos</a>
            <div className="dropdown">
              <Link to="/servicios" className="dropdown-toggle" aria-haspopup="true" aria-expanded="false">
                Servicios
              </Link>
              <div className="dropdown-menu" aria-label="Opciones de servicios">
                <Link to="/servicios/proyectos">Proyectos</Link>
                <Link to="/servicios/capacitacion">Capacitación</Link>
                <Link to="/servicios/software">Software</Link>
              </div>
            </div>
            <a href="#contacto">Contacto</a>
          </nav>
        </header>

        <div className="hero-grid" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">
              <span>Lógica aplicada a la gestión territorial.</span>
              <span>Soluciones geoespaciales inteligentes.</span>
            </p>
            <div className="hero-banner" role="region" aria-label="Mensaje principal de Terralógica en movimiento">
              <div className="hero-banner-track">
                {[...heroBannerParts, ...heroBannerParts].map((part, idx) => (
                  <article
                    key={`${part.text}-${idx}`}
                    className="hero-banner-card"
                    aria-hidden={idx >= heroBannerParts.length}
                    style={{ backgroundImage: part.video || part.videoHls ? undefined : `url(${part.image})` }}
                  >
                    {part.videoHls ? (
                      <video
                        ref={(node) => {
                          heroVideoRefs.current[idx] = node
                        }}
                        data-src={part.videoHls}
                        className="hero-banner-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                    ) : part.video ? (
                      <video
                        className="hero-banner-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      >
                        <source src={part.video} type="video/mp4" />
                      </video>
                    ) : null}
                    <p className="hero-banner-title">{part.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <p className="hero-text">
              En Terralógica ayudamos al cliente a entender su territorio, ordenar su manejo
              y detectar oportunidades con analítica aplicada, mapas y tableros listos
              para usar.
            </p>
            <div className="hero-actions">
              {clientTypes.map((client) => (
                <div key={client.id} className="client-button-wrapper">
                  <a 
                    className="primary-link" 
                    href="#contacto"
                    onMouseEnter={() => setHoveredClient(client.id)}
                    onMouseLeave={() => setHoveredClient(null)}
                  >
                    {client.label}
                  </a>
                  {hoveredClient === client.id && (
                    <div className="client-info-panel">
                      <p>{client.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel" aria-label="Resumen operativo">
            <div className="panel-card panel-card-main">
              <p className="panel-label">Nuestra oferta</p>
              <p className="panel-value">Proyectos, capacitación y software para la gestión territorial.</p>
            </div>
            <div className="signal-grid">
              {metrics.map((metric) => (
                <Link key={metric.value} to={`/servicios/${metric.slug}`} className="signal-card signal-link">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="difference-section" id="que-hacemos">
        <div className="difference-panel">
          <p className="eyebrow">Qué hacemos</p>
          <h2>
            Combinamos ciencia, técnica y tecnología para resolver problemas y detectar
            oportunidades en la gestión del territorio.
          </h2>
        </div>
        <div className="pillar-list">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="pillar-item">
              <span className="pillar-bullet"></span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section" id="metodologia">
        <div className="section-heading compact">
          <p className="eyebrow">Cómo lo hacemos</p>
          <h2>Un proceso claro y accionable para pasar de datos a decisiones ejecutables.</h2>
        </div>
        <div className="roadmap-container">
          <div className="roadmap-flow">
            {roadmap.map((item, idx) => (
              <div key={item.step} className="roadmap-item">
                <article className="roadmap-card">
                  <span className="roadmap-step">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
                {idx < roadmap.length - 1 && (
                  <svg className="roadmap-chevron" viewBox="0 0 40 100" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="5,30 35,50 5,70" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="contacto">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2>Si eres gobierno, empresa, organización, comunidad o persona, te ayudamos a gestionar mejor tu territorio.</h2>
        </div>
        <a className="primary-link" href="mailto:moraman61@gmail.com">
          Contacto
        </a>
      </section>
    </main>
  )
}

export default App
