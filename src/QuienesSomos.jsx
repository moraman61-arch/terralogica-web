import { Link } from 'react-router-dom'
import './App.css'

const identity = [
  {
    title: 'Misión',
    description:
      'Integramos el razonamiento científico, la técnica y la tecnología para ofrecer servicios geoespaciales innovadores que apoyen la gestión territorial de personas, comunidades, organizaciones, gobiernos y empresas.',
  },
  {
    title: 'Visión',
    description:
      'Aspiramos a convertirnos en el aliado preferido para la gestión territorial, con soluciones de inteligencia geoespacial confiables y de alto impacto para cada cliente.',
  },
]

const values = [
  {
    title: 'Eficacia',
    description: 'Cumplir a cabalidad con lo que el cliente requiere.',
  },
  {
    title: 'Eficiencia',
    description: 'Cumplir con lo que el cliente requiere minimizando los costos y maximizando los beneficios.',
  },
  {
    title: 'Equidad',
    description: 'Contribuir al desarrollo de personas, comunidades, organizaciones, instituciones y empresas, reconociendo su diversidad de fortalezas y debilidades.',
  },
]

function QuienesSomos() {
  return (
    <main className="page-shell subpage-shell">
      <section className="hero-section subpage-hero">
        <header className="topbar">
          <Link className="brand" to="/" aria-label="Ir al inicio de Terralógica">
            <img className="brand-logo" src="/terralogics-imago.png" alt="Imago de Terralógica" />
            <span className="brand-text">Terralógica</span>
          </Link>
          <nav className="topnav" aria-label="Secciones principales">
            <Link to="/">Inicio</Link>
          </nav>
        </header>

        <div className="subpage-intro">
          
          <h1>Quiénes somos</h1>
          <p className="hero-text">
            Transformamos conocimiento e información geográfica en soluciones concretas para la
            gestión territorial.
          </p>
        </div>
      </section>

      <section className="story-section">
        <article className="story-content">
          <p className="eyebrow">Por qué somos diferentes</p>
          <p>
            Nacimos con la filosofía del <em>λóγος-lógos</em>: el razonamiento. Somos científicos, técnicos y tecnólogos. Cuarenta años de trabajo en centros e institutos de investigación científica con técnicas y tecnologías geoespaciales nos respaldan. Eso no lo puede decir casi nadie en este país. En 1985, en la Universidad Nacional Autónoma de México, impartimos uno de los primeros cursos en el uso de la tecnología de los Sistemas de Información Geográfica. Desde entonces impulsamos la aplicación de estas experiencias para la gestión territorial, construimos capacidades individuales por miles (si, miles), resolvimos cientos de problemas, desarrollamos conocimiento… y lo aplicamos. El conocimiento adquirido y aplicado en esos 40 años nos dan la certeza de que <em>SABEMOS LO QUE HACEMOS</em>.
          </p>
        </article>
      </section>

      <section className="identity-section" id="quienes-somos">
        <div className="section-heading">
          <p className="eyebrow">Nuestra esencia</p>
          <h2> La gestión del territorio es nuestra razón de ser.</h2>
        </div>
        <div className="identity-grid">
          {identity.map((item) => (
            <article key={item.title} className="identity-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="identity-section" id="valores">
        <div className="section-heading">
          <p className="eyebrow">Nuestros compromisos</p>
          <h2>Valores que guían nuestro trabajo con el cliente: la Triple E.</h2>
        </div>
        <div className="values-grid">
          {values.map((value) => (
            <article key={value.title} className="identity-card">
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="eyebrow">Volver al inicio</p>
          <h2>Conoce cómo aplicamos este enfoque en cada servicio.</h2>
        </div>
        <Link className="primary-link" to="/">
          Ir a portada
        </Link>
      </section>
    </main>
  )
}

export default QuienesSomos
