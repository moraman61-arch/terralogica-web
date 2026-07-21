import { Link } from 'react-router-dom'
import './App.css'
import { assetPath } from './assetPath'

const projectServices = [
  {
    title: 'Medio Ambiente y Recursos Naturales',
    description:
      'Diseñamos proyectos para monitoreo ambiental, conservación de ecosistemas, manejo de cuencas y uso sostenible de recursos naturales.',
    image: assetPath('/proyectos/proyecto-medio-ambiente-recursos.png'),
    imageAlt: 'Imagen de referencia para proyectos de medio ambiente y recursos naturales',
  },
  {
    title: 'Planeación Urbana y Ordenamiento del Territorio',
    description:
      'Impulsamos iniciativas para ordenar el crecimiento urbano, zonificar usos del suelo y mejorar la ocupación equilibrada del territorio.',
    linkTo: '/servicios/proyectos/planeacion-ordenamiento',
    image: assetPath('/proyectos/proyecto-planeacion-urbana-ordenamiento.png'),
    imageAlt: 'Imagen de referencia para proyectos de planeacion urbana y ordenamiento del territorio',
  },
  {
    title: 'Agricultura y Desarrollo Rural',
    description:
      'Formulamos proyectos productivos con enfoque territorial para fortalecer cadenas agrícolas, acceso a servicios y desarrollo rural sostenible.',
    image: assetPath('/proyectos/proyecto-agricultura-desarrollo-rural.png'),
    imageAlt: 'Imagen de referencia para proyectos de agricultura y desarrollo rural',
  },
  {
    title: 'Gestión de Riesgos y Protección Civil',
    description:
      'Desarrollamos proyectos de prevención y respuesta ante amenazas naturales y antrópicas, analizando las amenazas, la vulnerabilidad y el riesgo.',
    linkTo: '/servicios/proyectos/gestion-riesgos-proteccion-civil',
    image: assetPath('/proyectos/proyecto-gestion-riesgos-proteccion-civil.png'),
    imageAlt: 'Imagen de referencia para proyectos de gestion de riesgos y proteccion civil',
  },
  {
    title: 'Gobernanza Territorial y Participación Ciudadana',
    description:
      'Diseñamos procesos participativos y proyectos colaborativos para mejorar la toma de decisiones territoriales entre actores públicos y sociales.',
    image: assetPath('/proyectos/proyecto-gobernanza-participacion.png'),
    imageAlt: 'Imagen de referencia para proyectos de gobernanza territorial y participacion ciudadana',
  },
  {
    title: 'Contaminación Ambiental y Salud Pública',
    description:
      'Implementamos proyectos para identificar fuentes de contaminación, evaluar impactos y priorizar acciones de mitigación con enfoque de salud pública.',
    image: assetPath('/proyectos/proyecto-contaminacion-salud-publica.png'),
    imageAlt: 'Imagen de referencia para proyectos de contaminacion ambiental y salud publica',
  },
  {
    title: 'Infraestructura, Movilidad y Transporte',
    description:
      'Estructuramos proyectos para optimizar redes de infraestructura y transporte, mejorando conectividad, seguridad y eficiencia operativa.',
    image: assetPath('/proyectos/proyecto-infraestructura-movilidad-transporte.png'),
    imageAlt: 'Imagen de referencia para proyectos de infraestructura movilidad y transporte',
  },
  {
    title: 'Turismo, Cultura y Patrimonio',
    description:
      'Desarrollamos proyectos para gestión de destinos, valorización cultural y protección del patrimonio con visión territorial integral.',
    image: assetPath('/proyectos/proyecto-turismo-cultura-patrimonio.png'),
    imageAlt: 'Imagen de referencia para proyectos de turismo cultura y patrimonio',
  },
  {
    title: 'Energía e Industrias Extractivas',
    description:
      'Diseñamos proyectos para localización, monitoreo y gestión territorial de actividades energéticas y extractivas con criterios ambientales y sociales.',
    image: assetPath('/proyectos/proyecto-energia-industrias-extractivas.png'),
    imageAlt: 'Imagen de referencia para proyectos de energia e industrias extractivas',
  },
  {
    title: 'Levantamiento de Información con Drones y Sensores Móviles',
    description:
      'Realizamos campañas de captura en campo con drones y sensores móviles para generar información geoespacial precisa, actualizada y lista para análisis territorial.',
    image: assetPath('/proyectos/img_0372.png'),
    imageAlt: 'Imagen de referencia para levantamiento de informacion con drones y sensores moviles',
  },
  {
    title: 'Diseño y Programación de Geovisores y Geoportales',
    description:
      'Desarrollamos plataformas web geográficas para visualizar, consultar y compartir información espacial mediante geovisores y geoportales adaptados a cada proyecto.',
    image: assetPath('/proyectos/proyecto-planeacion-urbana-ordenamiento.png'),
    imageAlt: 'Imagen de referencia para diseño y programacion de geovisores y geoportales',
  },
  {
    title: 'Servicios de Asesoría en Gestión Territorial',
    description:
      'Brindamos acompañamiento técnico y estratégico para la toma de decisiones, formulación de proyectos y fortalecimiento de procesos de gestión territorial.',
    image: assetPath('/proyectos/proyecto-gobernanza-participacion.png'),
    imageAlt: 'Imagen de referencia para servicios de asesoria en gestion territorial',
  },
]

function Proyectos() {
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
          </nav>
        </header>

        <div className="hero-copy subpage-intro">
          <h1>Proyectos de inteligencia territorial con impacto en campo.</h1>
          <p className="hero-text">
            Desarrollamos soluciones de análisis, modelado y monitoreo para proyectos que requieren una visión integral del territorio.
          </p>
        </div>
      </section>

      <section className="services-section projects-services-section">
        <div className="section-heading">
          <p className="eyebrow">Lo que hacemos</p>
          <h2>Impulsamos proyectos con datos, tecnología y ejecución de campo.</h2>
        </div>
        <div className="service-grid projects-grid">
          {projectServices.map((item) => (
            <article key={item.title} className="service-card project-card">
              {item.linkTo ? (
                <Link className="planeacion-project-image-link" to={item.linkTo} aria-label={`Abrir ${item.title}`}>
                  <img
                    className="project-card-image"
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                  />
                </Link>
              ) : (
                <img
                  className="project-card-image"
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.linkTo ? (
                <Link className="service-card-cta project-panel-link" to={item.linkTo}>
                  Proyectos
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Proyectos
