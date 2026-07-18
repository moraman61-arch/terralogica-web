import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js'
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
    title: 'Geológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas geológicas',
    mediaLabel: 'Imagen animada | monitoreo geológico continuo',
    description:
      'Analizamos amenazas asociadas a procesos geológicos como deslizamientos, fallamientos y fenómenos de inestabilidad del terreno.',
    sectionIntro:
      'Consolidamos información de campo, antecedentes y análisis espacial para identificar zonas críticas y definir prioridades de intervención.',
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
        title: 'Detección y análisis de fallas geológicas',
        description:
          'Integramos cartografía geológica y fotointerpretación para localizar estructuras activas y evaluar su posible influencia territorial.',
        points: [
          { name: 'Franja estructural - Sonora', x: 20, y: 52 },
          { name: 'Sistema de fallas - Querétaro', x: 54, y: 48 },
          { name: 'Bloque tectónico - Oaxaca', x: 78, y: 61 },
        ],
      },
      {
        title: 'Evaluación de inestabilidad en áreas urbanas',
        description:
          'Evaluamos taludes urbanos y zonas de expansión para orientar medidas de estabilización y gestión preventiva.',
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
    title: 'Hidrometeorológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas hidrometeorológicas',
    mediaLabel: 'Imagen animada | escenarios de lluvia y escurrimiento',
    description:
      'Evaluamos amenazas ligadas a lluvias extremas, inundaciones, ciclones, sequías y otros eventos atmosféricos con impacto territorial.',
    sectionIntro:
      'Desarrollamos escenarios por evento y temporada para apoyar decisiones de prevención, protección civil y planificación territorial.',
    solutions: [
      {
        title: 'Modelación de inundaciones urbanas',
        description:
          'Simulamos niveles de agua y zonas anegables para priorizar obras de drenaje, protocolos de alerta y rutas seguras.',
        points: [
          { name: 'Cuenca urbana - Villahermosa', x: 76, y: 68 },
          { name: 'Planicie aluvial - Veracruz', x: 72, y: 49 },
          { name: 'Valle bajo - Culiacán', x: 26, y: 41 },
        ],
      },
      {
        title: 'Análisis de sequía y estrés hídrico',
        description:
          'Identificamos patrones de déficit de precipitación y disponibilidad de agua para fortalecer la gestión hídrica regional.',
        points: [
          { name: 'Región semidesértica - Coahuila', x: 34, y: 24 },
          { name: 'Zona agrícola - Zacatecas', x: 43, y: 37 },
          { name: 'Bajío - Guanajuato', x: 53, y: 45 },
        ],
      },
      {
        title: 'Mapeo de exposición por ciclones',
        description:
          'Estimamos exposición de población e infraestructura frente a trayectorias ciclónicas para mejorar medidas de preparación.',
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
    title: 'Biológicas',
    image: '/proyectos/proyecto-gestion-riesgos-proteccion-civil.png',
    imageAlt: 'Vista ilustrativa para amenazas biológicas',
    mediaLabel: 'Imagen animada | vigilancia territorial de riesgos biológicos',
    description:
      'Desarrollamos análisis espaciales para reconocer riesgos de origen biológico y apoyar estrategias de vigilancia, prevención y respuesta.',
    sectionIntro:
      'Integramos información epidemiológica, ambiental y demográfica para focalizar acciones de salud pública y control sanitario.',
    solutions: [
      {
        title: 'Vigilancia geoespacial de vectores',
        description:
          'Ubicamos zonas de mayor probabilidad de presencia de vectores para optimizar brigadas y campañas de control.',
        points: [
          { name: 'Zona periurbana - Mérida', x: 86, y: 54 },
          { name: 'Corredor costero - Chiapas', x: 79, y: 77 },
          { name: 'Área metropolitana - Acapulco', x: 58, y: 70 },
        ],
      },
      {
        title: 'Análisis territorial de brotes',
        description:
          'Detectamos patrones espaciales y temporales de brotes para priorizar cercos sanitarios y acciones de contención.',
        points: [
          { name: 'Núcleo urbano - CDMX', x: 58, y: 52 },
          { name: 'Conurbación - Puebla', x: 67, y: 54 },
          { name: 'Valle central - Oaxaca', x: 70, y: 66 },
        ],
      },
      {
        title: 'Priorización de intervención sanitaria',
        description:
          'Combinamos indicadores de riesgo para definir zonas críticas de intervención y seguimiento operativo.',
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

const modelAssetBase = import.meta.env.BASE_URL || '/'

const modelSources = [
  `${modelAssetBase}amenazas/modelo-teposcolula-3d.centered.glb`,
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
      'Proyecto de referencia para análisis geológico de laderas con enfoque de riesgo en infraestructura carretera.',
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

    const map = L.map(mapContainerEl, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      attributionControl: true,
    })

    const fitMexico = () => {
      map.fitBounds(mexicoBounds, {
        paddingTopLeft: [14, 14],
        paddingBottomRight: [14, 14],
        maxZoom: 5,
      })
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 4,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

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
        .bindPopup(popupHtml, { maxWidth: 420 })

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
      map.invalidateSize(false)
      fitMexico()
    }

    map.whenReady(() => {
      requestAnimationFrame(refreshMapView)
    })

    const resizeObserver = new ResizeObserver(() => {
      refreshMapView()
    })
    resizeObserver.observe(mapContainerEl)

    window.addEventListener('resize', refreshMapView)

    mapInstanceRef.current = map

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', refreshMapView)

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <figure className="amenazas-mini-map" aria-label={`Mapa de proyectos para ${title}`}>
      <div ref={mapContainerRef} className="amenazas-leaflet-map" />
      <figcaption>Extensión inicial: México | Puntos ficticios: Oaxaca, Guerrero y Michoacán.</figcaption>
    </figure>
  )
}

function ThreatModelViewer({ sources, onSourceChange }) {
  const containerRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!containerRef.current || sources.length === 0) {
      return
    }

    const container = containerRef.current
    let disposed = false
    let animationFrameId = null
    let activeModel = null
    const modelPivot = new THREE.Group()

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#081b46')
    scene.add(modelPivot)

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 20000)
    camera.position.set(0, 0, 6)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    let controls = null
    try {
      controls = new ArcballControls(camera, renderer.domElement, scene)
      controls.enableAnimations = true
      if (typeof controls.setGizmosVisible === 'function') {
        controls.setGizmosVisible(false)
      }
      controls.enablePan = true
      controls.adjustNearFar = true
      controls.minDistance = 0.3
      controls.maxDistance = 10000
    } catch {
      setErrorMessage('No fue posible iniciar el modo Arcball en este navegador.')
      return () => {
        renderer.dispose()
        container.innerHTML = ''
      }
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const hemiLight = new THREE.HemisphereLight(0xdbe8ff, 0x2e3f66, 1.1)
    scene.add(hemiLight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
    keyLight.position.set(6, 12, 8)
    scene.add(keyLight)

    const backLight = new THREE.DirectionalLight(0x9fc2ff, 0.45)
    backLight.position.set(-10, 8, -10)
    scene.add(backLight)

    const cameraLight = new THREE.PointLight(0xffffff, 1.25, 0, 2)
    cameraLight.position.set(0, 0, 0)
    camera.add(cameraLight)

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.185.1/examples/jsm/libs/basis/')
    ktx2Loader.detectSupport(renderer)

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.setKTX2Loader(ktx2Loader)
    gltfLoader.setMeshoptDecoder(MeshoptDecoder)

    const getVisibleModelBounds = (rootObject) => {
      const visibleBounds = new THREE.Box3()
      let hasVisibleMesh = false

      rootObject.updateWorldMatrix(true, true)

      rootObject.traverse((node) => {
        if (!node.isMesh || !node.visible || !node.geometry) {
          return
        }

        if (!node.geometry.boundingBox) {
          node.geometry.computeBoundingBox()
        }

        if (!node.geometry.boundingBox) {
          return
        }

        const meshBounds = node.geometry.boundingBox.clone()
        meshBounds.applyMatrix4(node.matrixWorld)

        if (!hasVisibleMesh) {
          visibleBounds.copy(meshBounds)
          hasVisibleMesh = true
          return
        }

        visibleBounds.union(meshBounds)
      })

      if (!hasVisibleMesh) {
        return null
      }

      return visibleBounds
    }

    const fitCameraToBounds = (bounds) => {
      const box = bounds

      if (box.isEmpty()) {
        camera.position.set(0, 0, 6)
        if (typeof controls.setTarget === 'function') {
          controls.setTarget(0, 0, 0)
        }
        if (typeof controls.update === 'function') {
          controls.update()
        }
        return
      }

      const size = box.getSize(new THREE.Vector3())
      const center = new THREE.Vector3(
        box.min.x + size.x * 0.5,
        box.min.y + size.y * 0.5,
        box.min.z + size.z * 0.5,
      )
      const radius = Math.max(size.x, size.y, size.z) * 0.5
      const safeRadius = Math.max(radius, 1)
      const fov = THREE.MathUtils.degToRad(camera.fov)
      const distance = (safeRadius / Math.tan(fov / 2)) * 1.25

      camera.near = Math.max(distance / 1000, 0.01)
      camera.far = distance * 20
      camera.updateProjectionMatrix()

      // Vista inicial tipo frontal-oblicua para que abra similar al encuadre aprobado por el usuario.
      const initialTarget = new THREE.Vector3(
        center.x,
        center.y - safeRadius * 0.08,
        center.z,
      )
      const initialPosition = new THREE.Vector3(
        center.x - safeRadius * 0.04,
        center.y - safeRadius * 0.22,
        center.z + distance * 1.05,
      )

      camera.position.copy(initialPosition)
      if (typeof controls.setTarget === 'function') {
        controls.setTarget(initialTarget.x, initialTarget.y, initialTarget.z)
      } else if (controls.target) {
        controls.target.copy(initialTarget)
      }

      if (typeof controls.update === 'function') {
        controls.update()
      }
    }

    const recenterPivotToVisibleModelCenter = () => {
      const visibleBounds = getVisibleModelBounds(modelPivot)

      if (!visibleBounds || visibleBounds.isEmpty()) {
        return
      }

      const size = visibleBounds.getSize(new THREE.Vector3())
      const center = new THREE.Vector3(
        visibleBounds.min.x + size.x * 0.5,
        visibleBounds.min.y + size.y * 0.5,
        visibleBounds.min.z + size.z * 0.5,
      )

      modelPivot.position.sub(center)
      modelPivot.updateMatrixWorld(true)
    }

    const resize = () => {
      if (disposed) {
        return
      }

      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const animate = () => {
      if (disposed) {
        return
      }

      if (typeof controls.update === 'function') {
        controls.update()
      }
      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }

    const tryLoadSource = (sourceIndex) => {
      if (disposed) {
        return
      }

      if (sourceIndex >= sources.length) {
        setErrorMessage('No fue posible renderizar el modelo 3D en este navegador.')
        onSourceChange?.(-1)
        return
      }

      setErrorMessage('')
      onSourceChange?.(sourceIndex)

      gltfLoader.load(
        sources[sourceIndex],
        (gltf) => {
          if (disposed) {
            return
          }

          if (activeModel) {
            modelPivot.remove(activeModel)
          }

          activeModel = gltf.scene
          activeModel.traverse((node) => {
            if (!node.isMesh) {
              return
            }

            const meshMaterials = Array.isArray(node.material) ? node.material : [node.material]

            meshMaterials.forEach((material) => {
              if (!material) {
                return
              }

              if (material.map) {
                material.map.colorSpace = THREE.SRGBColorSpace
                material.map.needsUpdate = true
              }

              if ('envMapIntensity' in material) {
                material.envMapIntensity = Math.max(material.envMapIntensity || 0, 1.15)
              }

              if ('emissiveIntensity' in material) {
                material.emissiveIntensity = Math.max(material.emissiveIntensity || 0, 0.2)
              }

              if ('roughness' in material) {
                material.roughness = Math.min(material.roughness ?? 1, 0.95)
              }

              if ('metalness' in material) {
                material.metalness = Math.min(material.metalness ?? 0, 0.08)
              }

              if ('side' in material) {
                material.side = THREE.DoubleSide
              }

              if (!material.map && material.color && material.color.r < 0.08 && material.color.g < 0.08 && material.color.b < 0.08) {
                material.color.setRGB(0.7, 0.74, 0.8)
              }

              material.needsUpdate = true
            })
          })

          modelPivot.add(activeModel)
          recenterPivotToVisibleModelCenter()

          const visibleBounds = getVisibleModelBounds(modelPivot) || new THREE.Box3().setFromObject(modelPivot)
          fitCameraToBounds(visibleBounds)
        },
        undefined,
        () => {
          tryLoadSource(sourceIndex + 1)
        },
      )
    }

    tryLoadSource(0)
    animate()

    return () => {
      disposed = true

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      resizeObserver.disconnect()
      if (typeof controls.dispose === 'function') {
        controls.dispose()
      }
      ktx2Loader.dispose()
      dracoLoader.dispose()
      renderer.dispose()
      container.innerHTML = ''
    }
  }, [sources, onSourceChange])

  return (
    <div className="amenazas-three-viewer-shell">
      <div ref={containerRef} className="amenazas-three-canvas" />
      <div className="amenazas-three-help" aria-label="Indicaciones de navegación del modelo 3D">
        <p><strong>Cómo navegar:</strong> arrastra para rotar, rueda para acercar/alejar y clic derecho para desplazar.</p>
        <p><strong>En touch:</strong> 1 dedo rota, 2 dedos hacen zoom y paneo.</p>
      </div>
      {errorMessage ? (
        <p className="amenazas-model-loading">{errorMessage}</p>
      ) : null}
    </div>
  )
}

function Amenazas() {
  const [activeModelMarker, setActiveModelMarker] = useState(null)
  const [modelSourceIndex, setModelSourceIndex] = useState(0)

  useEffect(() => {
    if (!activeModelMarker) {
      return
    }

    setModelSourceIndex(0)
  }, [activeModelMarker])

  const openModelModal = (markerData) => {
    setModelSourceIndex(0)
    setActiveModelMarker(markerData)
  }

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
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img
                  className="planeacion-project-image"
                  src={projectType.image}
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
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">Soluciones que ofrecemos</p>
          <h2>Cada línea de amenaza integra análisis técnico, evidencia territorial y experiencia en campo.</h2>
        </div>

        <div className="amenazas-sections-grid">
          {amenazasProjectTypes.map((threatType) => (
            <article key={threatType.slug} id={threatType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img className="amenazas-media-image" src={threatType.image} alt="" loading="lazy" />
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
              <ThreatModelViewer sources={modelSources} onSourceChange={setModelSourceIndex} />
              <p className="amenazas-model-source-note">
                Fuente del modelo: {modelSourceIndex >= 0 ? modelSourceIndex + 1 : 'ninguna'} de {modelSources.length}
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default Amenazas