import { Link } from 'react-router-dom'
import './App.css'

const planeacionProjectTypes = [
  {
    title: 'Inventarios de Arbolado, Señalización y Luminarias',
    image: '/planeacion/inventario-puebla-01.png',
    imageAlt: 'Vista ilustrativa para inventarios urbanos',
    description:
      'Desarrollamos levantamientos territoriales para registrar, ubicar y evaluar infraestructura urbana clave para su mantenimiento y gestión.',
  },
  {
    title: 'Geoportales de información urbana',
    image: '/planeacion/inventario-guadalajara-01.png',
    imageAlt: 'Vista ilustrativa para geoportales de información urbana',
    description:
      'Construimos plataformas geoespaciales para consultar, compartir y analizar información urbana de manera clara y accesible.',
  },
  {
    title: 'Uso y Zonificación del Suelo',
    image: '/planeacion/uso-del-suelo-cd-salud.png',
    imageAlt: 'Vista ilustrativa para uso y zonificación del suelo',
    description:
      'Generamos insumos cartográficos y normativos para definir usos del suelo y orientar el crecimiento urbano con mayor orden.',
  },
  {
    title: 'Vivienda y Equipamiento Urbano',
    image: '/planeacion/conavi.png',
    imageAlt: 'Vista ilustrativa para vivienda y equipamiento urbano',
    description:
      'Analizamos cobertura, distribución y necesidades de vivienda y servicios urbanos para apoyar decisiones de inversión y planeación.',
  },
  {
    title: 'Ordenamiento Territorial',
    image: '/banners/ciencia-frontera-real.png',
    imageAlt: 'Vista ilustrativa para ordenamiento territorial',
    description:
      'Diseñamos proyectos para armonizar ocupación del territorio, vocaciones del suelo y dinámicas sociales, económicas y ambientales.',
  },
  {
    title: 'Seguridad y Bienestar Social',
    image: '/planeacion/iluminacion-campus.png',
    imageAlt: 'Vista ilustrativa para seguridad y bienestar social',
    description:
      'Aplicamos análisis territorial para identificar patrones espaciales que fortalezcan prevención, seguridad y bienestar comunitario.',
  },
]

function PlaneacionOrdenamiento() {
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

export default PlaneacionOrdenamiento
