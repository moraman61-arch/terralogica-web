import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const QuienesSomos = lazy(() => import('./QuienesSomos.jsx'))
const Servicios = lazy(() => import('./Servicios.jsx'))
const Proyectos = lazy(() => import('./Proyectos.jsx'))
const PlaneacionOrdenamiento = lazy(() => import('./PlaneacionOrdenamiento.jsx'))
const GestionRiesgosProteccionCivil = lazy(() => import('./GestionRiesgosProteccionCivil.jsx'))
const Amenazas = lazy(() => import('./Amenazas.jsx'))
const Vulnerabilidad = lazy(() => import('./Vulnerabilidad.jsx'))
const Riesgos = lazy(() => import('./Riesgos.jsx'))
const InventreesProyectos = lazy(() => import('./InventreesProyectos.jsx'))
const Capacitacion = lazy(() => import('./Capacitacion.jsx'))
const Software = lazy(() => import('./Software.jsx'))
const InventreesPlanes = lazy(() => import('./InventreesPlanes.jsx'))
const InventreesPolygon = lazy(() => import('./InventreesPolygon.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div className="route-loading">Cargando contenido...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/proyectos" element={<Proyectos />} />
          <Route path="/servicios/proyectos/planeacion-ordenamiento" element={<PlaneacionOrdenamiento />} />
          <Route path="/servicios/proyectos/gestion-riesgos-proteccion-civil" element={<GestionRiesgosProteccionCivil />} />
          <Route path="/servicios/proyectos/gestion-riesgos-proteccion-civil/amenazas" element={<Amenazas />} />
          <Route path="/servicios/proyectos/gestion-riesgos-proteccion-civil/vulnerabilidad" element={<Vulnerabilidad />} />
          <Route path="/servicios/proyectos/gestion-riesgos-proteccion-civil/riesgos" element={<Riesgos />} />
          <Route path="/servicios/proyectos/inventrees-proyectos" element={<InventreesProyectos />} />
          <Route path="/servicios/capacitacion" element={<Capacitacion />} />
          <Route path="/servicios/software" element={<Software />} />
          <Route path="/servicios/software/inventrees" element={<InventreesPlanes />} />
          <Route path="/servicios/software/inventrees/poligono" element={<InventreesPolygon />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
