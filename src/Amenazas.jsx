import { Link } from 'react-router-dom'
import './App.css'

const amenazasProjectTypes = [
  {
    title: 'Geológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas geológicas',
    description:
      'Analizamos amenazas asociadas a procesos geológicos como sismos, deslizamientos, fallamientos y fenómenos de inestabilidad del terreno.',
  },
  {
    title: 'Hidrometeorológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas hidrometeorológicas',
    description:
      'Evaluamos amenazas ligadas a lluvias extremas, inundaciones, ciclones, sequías y otros eventos atmosféricos con impacto territorial.',
  },
  {
    title: 'Biológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas biológicas',
    description:
      'Desarrollamos análisis espaciales para reconocer riesgos de origen biológico y apoyar estrategias de vigilancia, prevención y respuesta.',
  },
]

function Amenazas() {
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

export default Amenazas