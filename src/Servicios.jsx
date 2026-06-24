import './App.css'
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'Proyectos',
    slug: 'proyectos',
    description:
      'Gestionamos, diseñamos y ejecutamos proyectos con las proporciones correctas de ciencia, técnica y tecnología bajo los principios de eficacia, eficiencia y equidad.',
  },
  {
    title: 'Capacitación',
    slug: 'capacitacion',
    description:
      'Ofrecemos desde una asesoría de un solo día hasta cursos intensivos de una a dos semanas en un gran variedad de temas tanto científicos, como técnicos y tecnológicos.',
  },
  {
    title: 'Software',
    slug: 'software',
    description:
      'Desarrollamos y usamos nuestras propias herramientas innovadoras de software y también las ponemos a disposición de nuestros clientes para incrementar sus capacidades.',
  },
]

function Servicios() {
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
          <h1>Ofrecemos apoyo en tres áreas clave para la gestión territorial.</h1>
          <p className="hero-text">
            Sabemos por experiencia que cada organización enfrenta desafíos únicos en la gestión de su territorio, y estamos aquí para brindar soluciones adaptadas a sus necesidades.
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Portafolio</p>
          <h2>Estas áreas reflejan nuestro compromiso con la excelencia y la innovación al servicio de nuestros clientes.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <Link key={service.title} to={`/servicios/${service.slug}`} className="service-link">
              <article className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Servicios
