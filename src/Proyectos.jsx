import { Link } from 'react-router-dom'
import './App.css'

const projectServices = [
  {
    title: 'Medio Ambiente y Recursos Naturales',
    description:
      'Diseñamos proyectos para monitoreo ambiental, conservación de ecosistemas, manejo de cuencas y uso sostenible de recursos naturales.',
  },
  {
    title: 'Planeación Urbana y Ordenamiento del Territorio',
    description:
      'Impulsamos iniciativas para ordenar el crecimiento urbano, zonificar usos del suelo y mejorar la ocupación equilibrada del territorio.',
  },
  {
    title: 'Agricultura y Desarrollo Rural',
    description:
      'Formulamos proyectos productivos con enfoque territorial para fortalecer cadenas agrícolas, acceso a servicios y desarrollo rural sostenible.',
  },
  {
    title: 'Gestión de Riesgos y Protección Civil',
    description:
      'Desarrollamos proyectos de prevención, preparación y respuesta ante amenazas naturales y antrópicas, con base en análisis espacial de riesgo.',
  },
  {
    title: 'Gobernanza Territorial y Participación Ciudadana',
    description:
      'Diseñamos procesos participativos y proyectos colaborativos para mejorar la toma de decisiones territoriales entre actores públicos y sociales.',
  },
  {
    title: 'Contaminación Ambiental y Salud Pública',
    description:
      'Implementamos proyectos para identificar fuentes de contaminación, evaluar impactos y priorizar acciones de mitigación con enfoque de salud pública.',
  },
  {
    title: 'Infarestructura, Movilidad y Transporte',
    description:
      'Estructuramos proyectos para optimizar redes de infraestructura y transporte, mejorando conectividad, seguridad y eficiencia operativa.',
  },
  {
    title: 'Turismo, Cultura y Patrimonio',
    description:
      'Desarrollamos proyectos para gestión de destinos, valorización cultural y protección del patrimonio con visión territorial integral.',
  },
  {
    title: 'Energía e Industrias Extractivas',
    description:
      'Diseñamos proyectos para localización, monitoreo y gestión territorial de actividades energéticas y extractivas con criterios ambientales y sociales.',
  },
]

function Proyectos() {
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
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Proyectos
