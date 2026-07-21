import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const amenazasProjectTypes = [
  {
    slug: 'geologicas',
    title: 'Amenazas Geológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas geológicas',
    mediaLabel: 'Deslizamientos de Morelia, MICH.',
    description:
      'Analizamos amenazas asociadas a procesos geológico - geomorfológico como deslizamientos, fallamientos y fenómenos de inestabilidad del terreno.',
    sectionIntro:
      'Integramos información de campo, antecedentes y análisis geológico - geomorfológico para identificar zonas críticas y definir prioridades de intervención.',
    solutions: [
      {
        title: 'Estudios de deslizamientos de tierra',
        description:
          'Caracterizamos laderas, factores detonantes y patrones de ocurrencia para delimitar zonas de amenaza por movimientos en masa.',
        points: [
          { name: 'Ladera Oriente - Monterrey', x: 24, y: 33 },
          { name: 'Corredor serrano - Hidalgo', x: 49, y: 26 },
          { name: 'Cuenca alta - Puebla', x: 69, y: 41 },
        ],
      },
      {
        title: 'Detección y análisis de fallas',
        description:
          'Integramos cartografía geológica, datos de campo, paleogeomorfología e información topográfica de detalle para localizar estructuras activas y evaluar su impacto.',
        points: [
          { name: 'Franja estructural - Sonora', x: 20, y: 52 },
          { name: 'Sistema de fallas - Querétaro', x: 54, y: 48 },
          { name: 'Bloque tectónico - Oaxaca', x: 78, y: 61 },
        ],
      },
      {
        title: 'Evaluación de inestabilidad de taludes',
        description:
          'Evaluamos taludes en vías de comunicación y zonas urbanas para evaluar afectaciones y recomendar medidas de estabilización y de gestión preventiva.',
        points: [
          { name: 'Zona de taludes - Tijuana', x: 14, y: 22 },
          { name: 'Periferia urbana - Guadalajara', x: 44, y: 50 },
          { name: 'Borde urbano - Morelia', x: 62, y: 56 },
        ],
      },
    ],
  },
  {
    slug: 'hidrometeorologicas',
    title: 'Amenazas Hidrometeorológicas',
    image: '/proyectos/peligro-inundacion-subita1.png?v=20260720',
    panelImage: '/proyectos/peligro-inundacion-subita1.png?v=20260720',
    imageAlt: 'Vista ilustrativa para amenazas hidrometeorológicas',
    mediaLabel: 'Peligro de inundación súbita, Morelia, MICH.',
    description:
      'Evaluamos amenazas ligadas a lluvias extremas, inundaciones, erosión, ciclones, sequías y otros eventos atmosféricos con impacto territorial.',
    sectionIntro:
      'Desarrollamos escenarios por evento hidrometeorológico, cuenca, corriente de agua, o unidad de gestión territorial para apoyar decisiones de prevención, protección civil y planificación.',
    solutions: [
      {
        title: 'Modelación de inundaciones urbanas',
        description:
          'Definimos niveles de agua y zonas anegables, con topografía detallada y datos de campo para priorizar obras de drenaje, protocolos de alerta y rutas seguras.',
        points: [
          { name: 'Cuenca urbana - Villahermosa', x: 76, y: 68 },
          { name: 'Planicie aluvial - Veracruz', x: 72, y: 49 },
          { name: 'Valle bajo - Culiacán', x: 26, y: 41 },
        ],
      },
      {
        title: 'Análisis de sequía y estrés hídrico',
        description:
          'Identificamos patrones de déficit de precipitación y disponibilidad de agua de uso urbano, agrícola y pecuario, para fortalecer la gestión hídrica regional.',
        points: [
          { name: 'Región semidesértica - Coahuila', x: 34, y: 24 },
          { name: 'Zona agrícola - Zacatecas', x: 43, y: 37 },
          { name: 'Bajío - Guanajuato', x: 53, y: 45 },
        ],
      },
      {
        title: 'Mapeo de exposición por ciclones',
        description:
          'Estimamos exposición de población e infraestructura frente a trayectorias ciclónicas para definir medidas de preparación.',
        points: [
          { name: 'Litoral - Quintana Roo', x: 88, y: 58 },
          { name: 'Costa del Golfo - Tamaulipas', x: 67, y: 31 },
          { name: 'Costa del Pacífico - Guerrero', x: 60, y: 72 },
        ],
      },
    ],
  },
  {
    slug: 'biologicas',
    title: 'Amenazas Sanitarias',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    panelImage: '/proyectos/plagas-en-naranja.jpg?v=20260720',
    sectionImage: '/proyectos/plagas-en-naranja.jpg?v=20260720',
    imageAlt: 'Vista ilustrativa para amenazas sanitarias',
    mediaLabel: 'Plaga en cultivo de naranja, Linares , NL.',
    description:
      'Desarrollamos análisis espaciales para reconocer amenazas de origen sanitario y apoyar estrategias de vigilancia, prevención y respuesta.',
    sectionIntro:
      'Integramos información epidemiológica, ambiental y demográfica para focalizar acciones de salud pública y detección de plagas agrícolas y forestales.',
    solutions: [
      {
        title: 'Contaminación y salud pública',
        description:
          'Generamos inventarios de emisiones contaminantes, medimos la calidad del aire con sensores móviles y evaluamos su impacto en la salud pública.',
        points: [
          { name: 'Zona periurbana - Mérida', x: 86, y: 54 },
          { name: 'Corredor costero - Chiapas', x: 79, y: 77 },
          { name: 'Área metropolitana - Acapulco', x: 58, y: 70 },
        ],
      },
      {
        title: 'Temperaturas extremas: calor y frío',
        description:
          'Detectamos patrones espaciales y temporales de islas de calor urbanas y frío extremo, y evaluamos su impacto en la población.',
        points: [
          { name: 'Núcleo urbano - CDMX', x: 58, y: 52 },
          { name: 'Conurbación - Puebla', x: 67, y: 54 },
          { name: 'Valle central - Oaxaca', x: 70, y: 66 },
        ],
      },
      {
        title: 'Detección de plagas',
        description:
          'Empleamos imágenes de satélite y aéreas para identificar y predecir presencia de plagas en cultivos y en comunidades forestales.',
        points: [
          { name: 'Municipio prioritario - Tabasco', x: 78, y: 65 },
          { name: 'Nodo logístico - Jalisco', x: 45, y: 50 },
          { name: 'Franja fronteriza - Chihuahua', x: 32, y: 20 },
        ],
      },
    ],
  },
]

const mexicoBounds = [
  [14.3, -118.5],
  [33.2, -86.2],
]

const mexicoCenter = [23.6345, -102.5528]
const mexicoOverviewZoom = 3

const modelAssetBase = import.meta.env.BASE_URL || '/'

const modelSources = [
  `${modelAssetBase}amenazas/modelo-teposcolula-3d.centered.glb`,
  `${modelAssetBase}amenazas/modelo-teposcolula-3d.ktx2.4096.glb`,
  `${modelAssetBase}amenazas/modelo-teposcolula-3d.ktx2.centered.glb`,
  `${modelAssetBase}amenazas/modelo-teposcolula-3d.ktx2.glb`,
]

const demoMarkers = [
  {
    id: 'oaxaca',
    name: 'Oaxaca',
    lat: 17.07,
    lng: -97.68,
    popupTitle: 'Deslizamiento en la Carretera a San Juan Teposcolula, Oax.',
    popupBody:
      'Proyecto de referencia para análisis geomorfológico de laderas con enfoque de riesgo en infraestructura carretera.',
    hasModel: true,
  },
  {
    id: 'guerrero',
    name: 'Guerrero',
    lat: 17.44,
    lng: -99.52,
    popupTitle: 'Punto ficticio de proyecto en Guerrero',
    popupBody: 'Ubicación de demostración para futuras fichas de proyectos geológicos.',
    hasModel: false,
  },
  {
    id: 'michoacan',
    name: 'Michoacán',
    lat: 19.70,
    lng: -101.18,
    popupTitle: 'Punto ficticio de proyecto en Michoacán',
    popupBody: 'Ubicación de demostración para futuras fichas de proyectos geológicos.',
    hasModel: false,
  },
]

function ThreatProjectMap({ title, onOpenModel }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return
    }

    const mapContainerEl = mapContainerRef.current
    let activePopup = null
    let isDisposed = false
    const pendingTimeouts = []

    const map = L.map(mapContainerEl, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: true,
    })

    const fitMexico = () => {
      map.fitBounds(mexicoBounds, {
        paddingTopLeft: [22, 22],
        paddingBottomRight: [22, 22],
        maxZoom: mexicoOverviewZoom,
        animate: false,
      })
      map.setView(mexicoCenter, mexicoOverviewZoom, { animate: false })
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const centerPopupInMap = (popup) => {
      const popupEl = popup.getElement()

      if (!popupEl) {
        return
      }

      const mapRect = map.getContainer().getBoundingClientRect()
      const popupRect = popupEl.getBoundingClientRect()

      // Centrado geométrico exacto: esquina superior izquierda del popup
      // en (esquina superior izquierda del mapa + mitad de diferencias).
      const targetLeft = mapRect.left + (mapRect.width - popupRect.width) / 2
      const targetTop = mapRect.top + (mapRect.height - popupRect.height) / 2
      const deltaX = targetLeft - popupRect.left
      const deltaY = targetTop - popupRect.top

      if (Math.abs(deltaX) <= 0.5 && Math.abs(deltaY) <= 0.5) {
        return
      }

      const currentPos = L.DomUtil.getPosition(popupEl) || L.point(0, 0)
      L.DomUtil.setPosition(popupEl, L.point(currentPos.x + deltaX, currentPos.y + deltaY))
    }

    const centerPopupAfterOpen = (popup) => {
      requestAnimationFrame(() => {
        centerPopupInMap(popup)

        setTimeout(() => {
          centerPopupInMap(popup)
        }, 160)
      })
    }

    const recenterActivePopup = () => {
      if (!activePopup?.isOpen()) {
        return
      }

      centerPopupAfterOpen(activePopup)
    }

    fitMexico()

    demoMarkers.forEach((markerData) => {
      const popupHtml = markerData.hasModel
        ? `
          <div class="amenazas-popup-content">
            <h5>${markerData.popupTitle}</h5>
            <p>${markerData.popupBody}</p>
            <button type="button" class="amenazas-popup-open-btn" data-model-marker-id="${markerData.id}">Ver modelo 3D</button>
          </div>
        `
        : `
          <div class="amenazas-popup-content">
            <h5>${markerData.popupTitle}</h5>
            <p>${markerData.popupBody}</p>
          </div>
        `

      const mapMarker = L.circleMarker([markerData.lat, markerData.lng], {
        radius: 7,
        color: '#07193f',
        weight: 1.5,
        fillColor: '#2fd072',
        fillOpacity: 0.95,
      })
        .addTo(map)
        .bindPopup(popupHtml, {
          className: 'amenazas-leaflet-popup',
          maxWidth: 260,
          minWidth: 180,
          autoPan: false,
          keepInView: false,
        })

        mapMarker.on('popupopen', (event) => {
          activePopup = event.popup
          centerPopupAfterOpen(event.popup)
        })

      if (markerData.hasModel) {
        mapMarker.on('popupopen', (event) => {
          const popupEl = event.popup.getElement()
          const trigger = popupEl?.querySelector(`[data-model-marker-id="${markerData.id}"]`)

          if (trigger) {
            trigger.addEventListener('click', () => {
              onOpenModel(markerData)
              map.closePopup()
            }, { once: true })
          }
        })
      }

    })

    const refreshMapView = () => {
      if (isDisposed || mapInstanceRef.current !== map) {
        return
      }

      const container = map.getContainer()
      if (!container || !map._mapPane) {
        return
      }

      map.invalidateSize({ pan: false, debounceMoveend: true })
      fitMexico()
      recenterActivePopup()
    }

    map.on('popupclose', () => {
      activePopup = null
    })

    map.whenReady(() => {
      requestAnimationFrame(refreshMapView)
      pendingTimeouts.push(setTimeout(refreshMapView, 220))
      pendingTimeouts.push(setTimeout(refreshMapView, 700))
    })

    const resizeObserver = new ResizeObserver(() => {
      refreshMapView()
    })
    resizeObserver.observe(mapContainerEl)

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(refreshMapView)
          }
        })
      },
      { root: null, threshold: 0.15 },
    )
    intersectionObserver.observe(mapContainerEl)

    window.addEventListener('resize', refreshMapView)

    const enableWheelZoom = () => {
      map.scrollWheelZoom.enable()
    }

    const disableWheelZoom = () => {
      map.scrollWheelZoom.disable()
    }

    mapContainerEl.addEventListener('mouseenter', enableWheelZoom)
    mapContainerEl.addEventListener('mouseleave', disableWheelZoom)
    mapContainerEl.addEventListener('focusin', enableWheelZoom)
    mapContainerEl.addEventListener('focusout', disableWheelZoom)

    mapInstanceRef.current = map

    return () => {
      isDisposed = true
      pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId))

      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('resize', refreshMapView)
      mapContainerEl.removeEventListener('mouseenter', enableWheelZoom)
      mapContainerEl.removeEventListener('mouseleave', disableWheelZoom)
      mapContainerEl.removeEventListener('focusin', enableWheelZoom)
      mapContainerEl.removeEventListener('focusout', disableWheelZoom)

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [onOpenModel])

  return (
    <figure className="amenazas-mini-map" aria-label={`Mapa de proyectos para ${title}`}>
      <div ref={mapContainerRef} className="amenazas-leaflet-map" />
      <figcaption>Proyectos realizados. Rueda del ratón para acercar/alejar. Clic en los marcadores para más información.</figcaption>
    </figure>
  )
}

function ThreatModelScene({ modelUrl, verticalExaggeration }) {
  const modelRootRef = useRef(null)
  const controlsRef = useRef(null)
  const { camera, gl, size } = useThree()

  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.185.1/examples/jsm/libs/basis/')
    ktx2Loader.detectSupport(gl)

    loader.setDRACOLoader(dracoLoader)
    loader.setKTX2Loader(ktx2Loader)
    loader.setMeshoptDecoder(MeshoptDecoder)
  })

  const modelScene = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  useEffect(() => {
    modelScene.traverse((node) => {
      if (!node.isMesh || !node.material) {
        return
      }

      const materials = Array.isArray(node.material) ? node.material : [node.material]

      materials.forEach((material) => {
        if (!material) {
          return
        }

        if (material.map) {
          material.map.colorSpace = THREE.SRGBColorSpace
          material.map.needsUpdate = true
        }

        if (material.color) {
          material.color.setRGB(1, 1, 1)
        }

        if ('envMapIntensity' in material) {
          material.envMapIntensity = Math.max(material.envMapIntensity || 0, 1.15)
        }

        if ('roughness' in material) {
          material.roughness = Math.min(material.roughness ?? 1, 0.9)
        }

        if ('metalness' in material) {
          material.metalness = Math.min(material.metalness ?? 0, 0.08)
        }

        material.needsUpdate = true
      })
    })
  }, [modelScene])

  useEffect(() => {
    if (!modelRootRef.current || !controlsRef.current) {
      return
    }

    const box = new THREE.Box3().setFromObject(modelRootRef.current)
    if (box.isEmpty()) {
      return
    }

    const center = box.getCenter(new THREE.Vector3())
    const modelSize = box.getSize(new THREE.Vector3())
    const halfHeight = modelSize.z * 0.5
    const halfWidth = modelSize.x * 0.5
    const aspect = Math.max(size.width / Math.max(size.height, 1), 1e-3)
    const halfVerticalFov = THREE.MathUtils.degToRad(camera.fov * 0.5)

    // El terreno queda sobre el plano XZ; por eso el encuadre debe ajustarse
    // usando ancho=X y alto=Z, con cámara inicial desde +Y.
    const fitByHeight = halfHeight / Math.tan(halfVerticalFov)
    const fitByWidth = (halfWidth / aspect) / Math.tan(halfVerticalFov)
    const distance = Math.max(fitByHeight, fitByWidth) * 1.02

    camera.position.set(center.x, center.y + distance, center.z)
    camera.up.set(0, 0, 1)
    camera.near = Math.max(distance / 1500, 0.01)
    camera.far = distance * 35
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    controlsRef.current.target.copy(center)
    controlsRef.current.update()
  }, [camera, size.width, size.height, verticalExaggeration, modelScene])

  return (
    <>
      <ambientLight intensity={1.15} />
      <hemisphereLight args={[0xe6f0ff, 0x30456f, 1.2]} />
      <directionalLight position={[6, 12, 8]} intensity={1.3} />
      <directionalLight position={[-10, 7, -10]} intensity={0.65} color={0xbad7ff} />
      <pointLight position={[0, 0, 10]} intensity={0.55} />

      <group
        ref={modelRootRef}
        scale={[1, 1, verticalExaggeration]}
        rotation={[0, 0, THREE.MathUtils.degToRad(90)]}
      >
        <primitive object={modelScene} />
      </group>

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={0.01}
        maxPolarAngle={Math.PI / 2.1}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />
    </>
  )
}

function ThreatModelViewer({ modelUrl, verticalExaggeration }) {
  return (
    <div className="amenazas-three-viewer-shell">
      <div className="amenazas-three-canvas-wrap">
        <Canvas
          className="amenazas-three-canvas"
          dpr={[1, 2]}
          camera={{ fov: 36, near: 0.1, far: 20000 }}
          onCreated={({ gl: renderer }) => {
            renderer.outputColorSpace = THREE.SRGBColorSpace
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.35
          }}
        >
          <color attach="background" args={['#081b46']} />
          <Suspense
            fallback={(
              <Html center>
                <p className="amenazas-model-loading-inline">Cargando modelo 3D...</p>
              </Html>
            )}
          >
            <ThreatModelScene modelUrl={modelUrl} verticalExaggeration={verticalExaggeration} />
          </Suspense>
        </Canvas>
      </div>
      <div className="amenazas-three-help" aria-label="Indicaciones de navegación del modelo 3D">
        <p><strong>Cómo navegar:</strong> clic izquierdo y arrastra para rotar, rueda para acercar/alejar y clic derecho para desplazar.</p>
        <p><strong>En touch (Windows):</strong> click izquierdo y 1 dedo rota, 2 dedos hacen zoom y click derecho y 1 dedo para paneo.</p>
        <p><strong>En touch (MacOS):</strong> click izquierdo y 1 dedo rota, abrir con 2 dedos hacen zoom, presionar con 2 dedos y arrastrar para paneo.</p>
        <p><strong>En touch (Ipad):</strong> arrastrar con 1 dedo rota, abrir con 2 dedos hacen zoom, arrastrar con 2 dedos para paneo.</p>
      </div>
    </div>
  )
}

function Amenazas() {
  const [activeModelMarker, setActiveModelMarker] = useState(null)
  const [verticalExaggeration, setVerticalExaggeration] = useState(1.5)
  const [modelSourceIndex, setModelSourceIndex] = useState(0)

  const openModelModal = useCallback((markerData) => {
    setModelSourceIndex(0)
    setVerticalExaggeration(1.5)
    setActiveModelMarker(markerData)
  }, [])

  useEffect(() => {
    if (!activeModelMarker) {
      return
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveModelMarker(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeModelMarker])

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
          <h1>Amenazas</h1>
          <p className="hero-text">
            Conozca nuestra oferta de proyectos para analizar distintos tipos de amenazas y generar evidencia que fortalezca la gestión del riesgo.
          </p>
        </div>
      </section>

      <section className="services-section planeacion-projects-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Proyectos: Análisis de amenazas</p>
          <h2>Realizamos análisis de amenazas geológicas, hidrometeorológicas y sanitarias</h2>
        </div>
        <div className="service-grid projects-grid planeacion-projects-grid">
          {amenazasProjectTypes.map((projectType) => (
            <article key={projectType.title} className="service-card project-card planeacion-project-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img
                  className="planeacion-project-image"
                  src={projectType.panelImage ?? projectType.image}
                  alt={projectType.imageAlt}
                />
              </a>
              <h3>{projectType.title}</h3>
              <p>{projectType.description}</p>
              <a className="service-card-cta project-panel-link" href={`#${projectType.slug}`}>
                {projectType.title}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="services-section amenazas-detail-stack">
  

        <div className="amenazas-sections-grid">
          {amenazasProjectTypes.map((threatType) => (
            <article key={threatType.slug} id={threatType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img
                    className={`amenazas-media-image${threatType.slug === 'hidrometeorologicas' ? ' amenazas-media-image-hidrometeorologicas' : ''}${threatType.slug === 'biologicas' ? ' amenazas-media-image-sanitarias' : ''}`}
                    src={threatType.sectionImage ?? threatType.image}
                    alt=""
                    loading="lazy"
                  />
                  <div className="amenazas-media-overlay" />
                  <p className="amenazas-media-kicker">{threatType.mediaLabel}</p>
                </div>
                <div className="amenaza-section-copy">
                  <p className="eyebrow">Sección {threatType.title}</p>
                  <h3>{threatType.title}</h3>
                  <p>{threatType.sectionIntro}</p>
                </div>
              </header>

              <div className="amenaza-solutions-grid">
                {threatType.solutions.map((solution) => (
                  <article key={solution.title} className="amenaza-solution-card">
                    <h4>{solution.title}</h4>
                    <p>{solution.description}</p>
                    <ThreatProjectMap title={solution.title} onOpenModel={openModelModal} />
                  </article>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeModelMarker ? (
        <div className="amenazas-modal-backdrop" role="presentation" onClick={() => setActiveModelMarker(null)}>
          <section
            className="amenazas-model-modal"
            role="dialog"
            aria-modal="true"
            aria-label={activeModelMarker.popupTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="amenazas-model-modal-header">
              <h4>{activeModelMarker.popupTitle}</h4>
              <button
                type="button"
                className="amenazas-model-modal-close"
                onClick={() => setActiveModelMarker(null)}
                aria-label="Cerrar ventana de modelo 3D"
              >
                Cerrar
              </button>
            </header>

            <div className="amenazas-model-modal-body">
              <ThreatModelViewer modelUrl={modelSources[modelSourceIndex]} verticalExaggeration={verticalExaggeration} />
            </div>

            <div className="amenazas-model-relief-controls" aria-label="Control de exageración vertical del relieve">
              <span>Relieve:</span>
              <button
                type="button"
                className={verticalExaggeration === 1 ? 'is-active' : ''}
                onClick={() => setVerticalExaggeration(1)}
              >
                1x
              </button>
              <button
                type="button"
                className={verticalExaggeration === 1.5 ? 'is-active' : ''}
                onClick={() => setVerticalExaggeration(1.5)}
              >
                1.5x
              </button>
              <button
                type="button"
                className={verticalExaggeration === 2 ? 'is-active' : ''}
                onClick={() => setVerticalExaggeration(2)}
              >
                2x
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default Amenazas