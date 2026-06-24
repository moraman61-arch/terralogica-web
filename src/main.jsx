import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import QuienesSomos from './QuienesSomos.jsx'
import Servicios from './Servicios.jsx'
import Proyectos from './Proyectos.jsx'
import Capacitacion from './Capacitacion.jsx'
import Software from './Software.jsx'
import InventreesPlanes from './InventreesPlanes.jsx'
import InventreesPolygon from './InventreesPolygon.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/servicios/proyectos" element={<Proyectos />} />
        <Route path="/servicios/capacitacion" element={<Capacitacion />} />
        <Route path="/servicios/software" element={<Software />} />
        <Route path="/servicios/software/inventrees" element={<InventreesPlanes />} />
        <Route path="/servicios/software/inventrees/poligono" element={<InventreesPolygon />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
