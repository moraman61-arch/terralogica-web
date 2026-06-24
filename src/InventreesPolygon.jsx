import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const polygonStorageKey = 'inventrees-polygon-registration'
const defaultView = [18, 0]
const defaultZoom = 2

function persistPolygonRegistration(payload) {
  window.localStorage.setItem(polygonStorageKey, JSON.stringify(payload))
}

function polygonToKmlText(polygonCoordinates) {
  if (!Array.isArray(polygonCoordinates) || polygonCoordinates.length < 3) {
    return null
  }

  const closedCoordinates = [...polygonCoordinates]
  const [firstLat, firstLng] = closedCoordinates[0]
  const [lastLat, lastLng] = closedCoordinates[closedCoordinates.length - 1]

  if (firstLat !== lastLat || firstLng !== lastLng) {
    closedCoordinates.push([firstLat, firstLng])
  }

  const coordinatesText = closedCoordinates.map(([lat, lng]) => `${lng},${lat},0`).join(' ')

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>INVENTREES</name>
    <Placemark>
      <name>Área de interés</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinatesText}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>
`
}

function pointInPolygon(point, polygonRing) {
  let isInside = false
  const [x, y] = point

  for (let i = 0, j = polygonRing.length - 1; i < polygonRing.length; j = i, i += 1) {
    const [xi, yi] = polygonRing[i]
    const [xj, yj] = polygonRing[j]

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || Number.EPSILON) + xi
    if (intersects) {
      isInside = !isInside
    }
  }

  return isInside
}

function haversineDistanceKm([lon1, lat1], [lon2, lat2]) {
  const toRadians = (value) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

function estimateSegmentInsideRatio(startPoint, endPoint, polygonRing, samples = 12) {
  let insideSamples = 0

  for (let index = 0; index < samples; index += 1) {
    const t = (index + 0.5) / samples
    const samplePoint = [
      startPoint[0] + (endPoint[0] - startPoint[0]) * t,
      startPoint[1] + (endPoint[1] - startPoint[1]) * t,
    ]

    if (pointInPolygon(samplePoint, polygonRing)) {
      insideSamples += 1
    }
  }

  return insideSamples / samples
}

function buildRoadLengthQuery(polygonCoordinates) {
  const closedPolygon =
    polygonCoordinates.length > 2 &&
    (polygonCoordinates[0][0] !== polygonCoordinates[polygonCoordinates.length - 1][0] ||
      polygonCoordinates[0][1] !== polygonCoordinates[polygonCoordinates.length - 1][1])
      ? [...polygonCoordinates, polygonCoordinates[0]]
      : polygonCoordinates

  const polygonLatLon = closedPolygon.map(([lat, lon]) => `${lat} ${lon}`).join(' ')

  return `[out:json][timeout:30];
(
  way["highway"]["highway"!~"footway|path|cycleway|bridleway|steps|pedestrian|corridor"](poly:"${polygonLatLon}");
);
out geom;`
}

async function estimateRoadLengthInsidePolygonKm(polygonCoordinates) {
  if (!Array.isArray(polygonCoordinates) || polygonCoordinates.length < 3) {
    return null
  }

  const query = buildRoadLengthQuery(polygonCoordinates)
  const polygonRingLonLat = polygonCoordinates.map(([lat, lon]) => [lon, lat])

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
      body: query,
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const wayElements = Array.isArray(data?.elements) ? data.elements.filter((element) => element.type === 'way') : []

    let totalLengthKm = 0

    for (const wayElement of wayElements) {
      const geometry = Array.isArray(wayElement.geometry) ? wayElement.geometry : []
      if (geometry.length < 2) {
        continue
      }

      for (let pointIndex = 0; pointIndex < geometry.length - 1; pointIndex += 1) {
        const start = [geometry[pointIndex].lon, geometry[pointIndex].lat]
        const end = [geometry[pointIndex + 1].lon, geometry[pointIndex + 1].lat]
        const segmentLengthKm = haversineDistanceKm(start, end)

        if (segmentLengthKm === 0) {
          continue
        }

        const insideRatio = estimateSegmentInsideRatio(start, end, polygonRingLonLat)
        totalLengthKm += segmentLengthKm * insideRatio
      }
    }

    return Number(totalLengthKm.toFixed(2))
  } catch {
    return null
  }
}

function readPolygonRegistration() {
  try {
    const rawValue = window.localStorage.getItem(polygonStorageKey)
    if (!rawValue) {
      return { status: 'pending', polygon: null, polygonSource: null }
    }

    const parsedValue = JSON.parse(rawValue)
    const status = parsedValue?.status === 'registered' ? 'registered' : 'pending'
    const polygon = Array.isArray(parsedValue?.polygon) ? parsedValue.polygon : null
    return {
      ...parsedValue,
      status,
      polygon,
      polygonSource: parsedValue?.polygonSource ?? null,
    }
  } catch {
    // Se ignora el estado corrupto y se muestra el valor por defecto.
  }

  return { status: 'pending', polygon: null, polygonSource: null }
}

function InventreesPolygon() {
  const navigate = useNavigate()
  const initialRegistrationState = useMemo(() => readPolygonRegistration(), [])
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const polygonLayerRef = useRef(null)
  const drawingPointsRef = useRef([])
  const isDrawingRef = useRef(true)
  const [searchText, setSearchText] = useState('')
  const [searchStatus, setSearchStatus] = useState(
    Array.isArray(initialRegistrationState.polygon) && initialRegistrationState.polygon.length >= 3
      ? initialRegistrationState.status === 'registered'
        ? 'Existe un polígono registrado previamente. Puede redefinirlo.'
        : 'Se cargó un polígono pendiente. Revíselo y acepte si corresponde.'
      : 'Escribe una ciudad o lugar para centrar el mapa.',
  )
  const [drawingPointCount, setDrawingPointCount] = useState(
    Array.isArray(initialRegistrationState.polygon)
      ? initialRegistrationState.polygon.length
      : 0,
  )
  const [polygonPreview, setPolygonPreview] = useState(
    Array.isArray(initialRegistrationState.polygon)
      ? initialRegistrationState.polygon.map(([lat, lng]) => L.latLng(lat, lng))
      : null,
  )
  const [isSearching, setIsSearching] = useState(false)
  const [isEstimatingRoads, setIsEstimatingRoads] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return undefined
    }

    const map = L.map(mapContainerRef.current, {
      worldCopyJump: true,
      doubleClickZoom: false,
    }).setView(defaultView, defaultZoom)

    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    const updatePreview = () => {
      const points = drawingPointsRef.current
      setDrawingPointCount(points.length)

      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove()
        polygonLayerRef.current = null
      }

      if (points.length >= 3) {
        polygonLayerRef.current = L.polygon(points, {
          color: '#dca060',
          weight: 3,
          fillColor: '#2276d5',
          fillOpacity: 0.22,
        }).addTo(map)
      } else if (points.length > 0) {
        polygonLayerRef.current = L.polyline(points, {
          color: '#dca060',
          weight: 3,
          dashArray: '8 8',
        }).addTo(map)
      }

      setPolygonPreview(points.length >= 3 ? [...points] : null)
    }

    const handleMapClick = (event) => {
      if (!isDrawingRef.current) {
        return
      }

      drawingPointsRef.current = [...drawingPointsRef.current, event.latlng]
      updatePreview()
    }

    const finalizePolygon = () => {
      if (!isDrawingRef.current) {
        return
      }

      if (drawingPointsRef.current.length < 3) {
        setSearchStatus('Agrega al menos tres puntos para cerrar el polígono.')
        return
      }

      updatePreview()
      setSearchStatus('Polígono trazado. Puede borrarlo, aceptarlo o cancelarlo.')
      isDrawingRef.current = false
    }

    map.on('click', handleMapClick)
    map.on('dblclick', finalizePolygon)

    const savedState = initialRegistrationState
    if (Array.isArray(savedState.polygon) && savedState.polygon.length >= 3) {
      const savedLayer = L.polygon(savedState.polygon, {
        color: savedState.status === 'registered' ? '#78e08f' : '#dca060',
        weight: 3,
        fillColor: savedState.status === 'registered' ? '#1f8f57' : '#2276d5',
        fillOpacity: savedState.status === 'registered' ? 0.28 : 0.22,
      }).addTo(map)

      polygonLayerRef.current = savedLayer
      drawingPointsRef.current = savedState.polygon.map(([lat, lng]) => L.latLng(lat, lng))
      map.fitBounds(savedLayer.getBounds(), { padding: [24, 24] })
    }

    return () => {
      map.off('click', handleMapClick)
      map.off('dblclick', finalizePolygon)
      map.remove()
      mapRef.current = null
      polygonLayerRef.current = null
    }
  }, [initialRegistrationState])

  const resetDrawing = () => {
    drawingPointsRef.current = []
    isDrawingRef.current = true
    setDrawingPointCount(0)
    setPolygonPreview(null)
    setSearchStatus('Polígono borrado. Puede iniciar uno nuevo con clic izquierdo.')

    if (polygonLayerRef.current) {
      polygonLayerRef.current.remove()
      polygonLayerRef.current = null
    }
  }

  const handleSearchSubmit = async (event) => {
    event.preventDefault()

    const trimmedSearch = searchText.trim()
    if (!trimmedSearch || !mapRef.current) {
      return
    }

    setIsSearching(true)
    setSearchStatus(`Buscando ${trimmedSearch}...`)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(trimmedSearch)}`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      const results = await response.json()

      if (!Array.isArray(results) || results.length === 0) {
        setSearchStatus('No se encontró el lugar solicitado. Pruebe con otro nombre.')
        return
      }

      const [result] = results
      const latitude = Number(result.lat)
      const longitude = Number(result.lon)

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        mapRef.current.setView([latitude, longitude], Math.max(mapRef.current.getZoom(), 10))
        L.circleMarker([latitude, longitude], {
          radius: 9,
          color: '#dca060',
          weight: 3,
          fillColor: '#2276d5',
          fillOpacity: 0.9,
        })
          .addTo(mapRef.current)
          .bindPopup(result.display_name)
          .openPopup()
        setSearchStatus(`Mapa centrado en ${result.display_name}.`)
      }
    } catch {
      setSearchStatus('No fue posible completar la búsqueda en este momento.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAccept = async () => {
    if (!polygonPreview || polygonPreview.length < 3) {
      setSearchStatus('Dibuje un polígono válido antes de aceptarlo.')
      return
    }

    setIsEstimatingRoads(true)
    setSearchStatus('Calculando km de vialidades dentro del polígono...')

    const polygonCoordinates = polygonPreview.map((point) => [point.lat, point.lng])
    const estimatedRoadLengthKm = await estimateRoadLengthInsidePolygonKm(polygonCoordinates)
    const polygonAttachment =
      initialRegistrationState.polygonAttachment ??
      {
        name: 'inventrees-poligono.kml',
        mimeType: 'application/vnd.google-earth.kml+xml',
        encoding: 'text',
        data: polygonToKmlText(polygonCoordinates),
      }

    persistPolygonRegistration({
      status: 'registered',
      polygon: polygonCoordinates,
      roadLengthKm: estimatedRoadLengthKm,
      polygonAttachment,
      polygonSource: initialRegistrationState.polygonSource ?? 'manual',
      updatedAt: new Date().toISOString(),
    })

    setIsEstimatingRoads(false)
    navigate('/servicios/software/inventrees')
  }

  const handleCancel = () => {
    persistPolygonRegistration({
      status: 'pending',
      polygon: null,
      roadLengthKm: null,
      polygonSource: null,
      updatedAt: new Date().toISOString(),
    })
    navigate('/servicios/software/inventrees')
  }

  return (
    <main className="page-shell subpage-shell inventory-map-shell">
      <section className="hero-section subpage-hero inventory-map-hero">
        <header className="topbar">
          <Link className="brand" to="/servicios/software/inventrees" aria-label="Volver a INVENTREES">
            <img className="brand-logo" src="/terralogics-imago.png" alt="Imago de Terralógica" />
            <span className="brand-text">Terralógica</span>
          </Link>
          <nav className="topnav" aria-label="Navegación secundaria">
            <Link to="/servicios/software/inventrees">Regresar</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro inventory-map-intro">
          <p className="eyebrow">Polígono de área de interés</p>
          <h1>Dibuje el polígono y confirme el área que desea registrar.</h1>
          <p className="hero-text">
            Haga clic izquierdo para agregar vértices, doble clic para cerrar el polígono, use el buscador para centrar el mapa y vuelva a definirlo cuando sea necesario.
          </p>
          <div className={`inventory-polygon-status inventory-polygon-status-${initialRegistrationState.status}`}>
            {initialRegistrationState.status === 'registered' ? 'Polígono registrado' : 'Polígono no registrado'}
          </div>
        </div>
      </section>

      <section className="services-section inventory-map-section">
        <div className="inventory-map-help">
          <p>Instrucciones:</p>
          <ul>
            <li>Use el mapa para navegar con zoom y desplazamiento.</li>
            <li>Si lo necesita, busque una ciudad para centrar la vista.</li>
            <li>Agregue puntos con clic izquierdo y cierre con doble clic.</li>
            <li>Borre el polígono para empezar de nuevo antes de aceptar.</li>
          </ul>
        </div>

        <div className="inventory-map-layout">
          <aside className="inventory-map-side" aria-label="Panel de herramientas">
            <form className="inventory-search-form" onSubmit={handleSearchSubmit}>
              <label className="inventory-field inventory-search-field">
                <span>Buscar lugar</span>
                <input
                  type="search"
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Ej. Ciudad de México, Lima, Bogotá"
                />
              </label>
              <button type="submit" className="primary-link inventory-tool-button" disabled={isSearching}>
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            <div className="inventory-tool-group" aria-label="Herramientas de polígono">
              <button
                type="button"
                className="primary-link inventory-tool-button"
                onClick={() => {
                  isDrawingRef.current = true
                  setSearchStatus('Modo dibujo activo. Haga clic izquierdo para marcar puntos.')
                }}
              >
                Dibujar polígono
              </button>
              <button type="button" className="primary-link inventory-tool-button" onClick={resetDrawing}>
                Borrar polígono
              </button>
              <button
                type="button"
                className="primary-link inventory-tool-button inventory-tool-button-accept"
                onClick={handleAccept}
                disabled={isEstimatingRoads}
              >
                {isEstimatingRoads ? 'Calculando km...' : 'Aceptar polígono'}
              </button>
              <button
                type="button"
                className="primary-link inventory-tool-button inventory-tool-button-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>

            <div className="inventory-map-status">
              <p>{searchStatus}</p>
              <p>
                Vértices actuales: <strong>{drawingPointCount}</strong>
              </p>
              <p>
                Estado inicial:{' '}
                <strong>{initialRegistrationState.status === 'registered' ? 'Polígono registrado' : 'Polígono no registrado'}</strong>
              </p>
            </div>
          </aside>

          <div className="inventory-map-main">
            <div className="inventory-map-frame">
              <div ref={mapContainerRef} className="inventory-map-canvas" aria-label="Mapa interactivo para dibujar el polígono" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default InventreesPolygon
