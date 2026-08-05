import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Link, useLocation } from 'react-router-dom'
import './App.css'

const quoteRecipientEmail = 'info@terralogica.mx'
const polygonStorageKey = 'inventrees-polygon-registration'
const projectQuotePrefillStorageKey = 'inventrees-project-quote-prefill'
const quoteApiUrl = (import.meta.env.VITE_QUOTE_API_URL || '/api/quote').trim()
const maxQuoteUploadSizeBytes = 9 * 1024 * 1024

const quoteServicePanels = [
  {
    id: 'geolocalizacion',
    title: 'Geolocalización',
    options: [
      { id: 'geo-arboles-vivos', label: 'Geolocalización de árboles vivos' },
      { id: 'geo-cepas-vacantes', label: 'Geolocalización de cepas vacantes' },
      { id: 'geo-tocones', label: 'Geolocalización de tocones' },
      { id: 'geo-arboles-muertos', label: 'Geolocalización de árboles muertos' },
    ],
  },
  {
    id: 'medicion',
    title: 'Medición',
    options: [
      { id: 'med-inclinacion', label: 'Medición de inclinación' },
      { id: 'med-dap', label: 'Medición de DAP (1.30 m)' },
      { id: 'med-copa', label: 'Medición de copa' },
      { id: 'med-altura', label: 'Medición de altura' },
      { id: 'med-desbalance-copa', label: 'Estimación de desbalance de copa' },
    ],
  },
  {
    id: 'caracterizacion',
    title: 'Caracterización',
    options: [
      { id: 'car-ia-especie', label: 'Identificación de especie con IA' },
      { id: 'car-estructura', label: 'Estructura del árbol' },
      { id: 'car-mantenimiento', label: 'Indicación de mantenimiento' },
      { id: 'car-desmoche', label: 'Indicación de desmoche' },
      {
        id: 'car-interferencia',
        label: 'Indicación de interferencia con infraestructura aérea y terrestre',
      },
    ],
  },
]

const supportedPolygonExtensions = ['.zip', '.kml', '.geojson', '.json']

function readPolygonRegistration() {
  try {
    const rawValue = window.localStorage.getItem(polygonStorageKey)
    if (!rawValue) {
      return {
        status: 'pending',
        polygon: null,
        polygonAttachment: null,
        polygonFileName: null,
      }
    }

    const parsedValue = JSON.parse(rawValue)
    return {
      ...parsedValue,
      status: parsedValue?.status === 'registered' ? 'registered' : 'pending',
      polygon: Array.isArray(parsedValue?.polygon) ? parsedValue.polygon : null,
      polygonAttachment: parsedValue?.polygonAttachment ?? null,
      polygonFileName: parsedValue?.polygonFileName ?? null,
    }
  } catch {
    return {
      status: 'pending',
      polygon: null,
      polygonAttachment: null,
      polygonFileName: null,
    }
  }
}

function persistPolygonRegistration(payload) {
  window.localStorage.setItem(polygonStorageKey, JSON.stringify(payload))
}

function readProjectQuotePrefill() {
  try {
    const rawValue = window.localStorage.getItem(projectQuotePrefillStorageKey)
    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue)
    if (!parsedValue || typeof parsedValue !== 'object') {
      return null
    }

    return parsedValue
  } catch {
    return null
  }
}

function clearProjectQuotePrefill() {
  try {
    window.localStorage.removeItem(projectQuotePrefillStorageKey)
  } catch {
    // Ignore storage cleanup errors.
  }
}

function attachmentToFile(attachment) {
  if (!attachment) {
    return null
  }

  if (attachment.encoding === 'base64') {
    const binaryString = window.atob(attachment.data)
    const bytes = new Uint8Array(binaryString.length)
    for (let index = 0; index < binaryString.length; index += 1) {
      bytes[index] = binaryString.charCodeAt(index)
    }
    return new File([bytes], attachment.name, { type: attachment.mimeType })
  }

  return new File([attachment.data], attachment.name, { type: attachment.mimeType })
}

function buildAttachmentFileFromRegistration(registration) {
  return attachmentToFile(registration?.polygonAttachment)
}

function getRegisteredPolygonFileName(registration) {
  if (typeof registration?.polygonFileName === 'string' && registration.polygonFileName.trim()) {
    return registration.polygonFileName.trim()
  }

  if (typeof registration?.polygonAttachment?.name === 'string' && registration.polygonAttachment.name.trim()) {
    return registration.polygonAttachment.name.trim()
  }

  if (registration?.status === 'registered' && Array.isArray(registration?.polygon) && registration.polygon.length >= 3) {
    return 'inventrees-poligono.kml'
  }

  return null
}

function isSupportedPolygonFile(fileName) {
  const lowerName = fileName.toLowerCase()
  return supportedPolygonExtensions.some((extension) => lowerName.endsWith(extension))
}

function formatFileSizeMb(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0.00'
  }

  return (bytes / (1024 * 1024)).toFixed(2)
}

const inventreesProjectTypes = [
  {
    slug: 'arbolado-publico',
    title: 'Arbolado público',
    image: '/inventrees/inventario-arbolado-publico.png',
    videoSrc: '/videos/presentacion-inventrees.mp4',
    postVideoTextBeforeLink:
      'Diseñamos y desarrollamos su proyecto de inventario de arbolado por etapas, según sus necesidades y presupuesto. Para localidades pequeñas y medias recomendamos la ',
    postVideoLinkText: 'renta del software',
    postVideoLinkTo: '/servicios/software/inventrees',
    postVideoTextAfterLink:
      ' a un costo muy reducido. Para las ciudades grandes ofrecemos elaborar su inventario en un tiempo de hasta 1 año dependiendo de su extensión, y el número de árboles y tipo de atributos que desea incluir en el inventario.',
    featuredProjectsTitle: 'Proyectos Destacados',
    featuredProjectsImage: '/inventrees/arbolado-zmg-01.png',
    featuredProjectsImageAlt: 'Inventario de arbolado público urbano de la Zona Metropolitana de Guadalajara',
    featuredProjectsSecondImage: '/inventrees/InventarioCDMX01.png',
    featuredProjectsSecondImageAlt: 'INVENTREES CDMX | Portal de Seguimiento 1a. Etapa',
    featuredProjectsSecondImageLink:
      'https://ciga-unam.maps.arcgis.com/apps/instant/compare/index.html?appid=c592a4b7222042d58d22c8006c3bbfa6',
    featuredProjectsSecondImageLabel: 'INVENTREES CDMX | Portal de Seguimiento 1a. Etapa',
    featuredProjectsSectionHeadings: [
      'INVENTARIO DE LA ZONA METROPOLITANA DE GUADALAJARA',
      'INVENTARIO DE LA CIUDAD DE MÉXICO',
    ],
    featuredProjectsNotes: [
      'En 2017, para el Gobierno de Jalisco, participamos en el proyecto de Inventario del Arbolado Público Urbano de la Zona Metropolitana de Guadalajara, que abarcó siete municipios. En total se geolocalizaron 1,158,009 árboles, de los cuales, una muestra de poco más de 44,000, posee información detallada (haga clic en la imagen para abrir el geovisualizador del proyecto):',
      'Desde agosto de 2026, para el Gobierno de la Ciudad de México, iniciamos la Etapa de Geolocalización del proyecto de Inventario de Arbolado Público Urbano de la CDMX, que comprende las 16 alcaldias y que concluirá en Diciembre de 2026. En el 2027 realizaremos las Etapas de Medición y Caracterización. Se estima que el inventario incluirá poco más de 3,000,000 de árboles.',
    ],
    imageAlt: 'Imagen de referencia para inventario de arbolado publico',
    mediaLabel: 'Inventario y gestión de arbolado urbano.',
    description:
      'Levantamiento y organización del arbolado urbano que se encuentra en los espacios públicos de la ciudad. El inventario registra la geolocalización, medición y caracterización de cada árbol, así como la generación de reportes y mapas por unidad administrativa / funcional de la ciudad para la gestión del arbolado urbano.',
    sectionIntro:
      'Integramos geolocalización, medición y caracterización del arbolado en los espacios públicos para construir inventarios de arbolado útiles para mantenimiento, diagnóstico de riesgo y planeación operativa.',
    solutions: [
      {
        title: 'Registro georreferenciado de ejemplares',
        description:
          'Ubicamos cada árbol en imágenes de nivel de calle y consolidamos una base de datos para consulta, actualización y seguimiento por colonia, vialidad o municipio.',
      },
      {
        title: 'Medición y caracterización del arbolado',
        description:
          'Documentamos especie, dimensiones, condición física e interferencias para apoyar decisiones de poda, sustitución y conservación.',
      },
      {
        title: 'Reportes y mapas para gestión urbana',
        description:
          'Generamos tableros, mapas temáticos y reportes ejecutivos para priorizar atención, presupuesto y acciones de mantenimiento.',
      },
    ],
  },
  {
    slug: 'senalizacion-de-calle',
    title: 'Señalización de calle',
    image: '/inventrees/inventario-senalizacion-calle.png',
    imageAlt: 'Imagen de referencia para inventario de senalizacion urbana',
    mediaLabel: 'Inventario de señalética y seguridad vial.',
    description:
      'La señalética urbana requiere un sistema de inventario que ayude a garantizar la seguridad y eficiencia del tránsito, y a orientar, guiar e informar adecuadamente a los ciudadanos y visitantes de la ciudad. El inventario contiene la ubicación, características y condición de las señales verticales en los espacios públicos de la ciudad.',
    sectionIntro:
      'Desarrollamos inventarios de señalización para ordenar activos, detectar faltantes, evaluar condición y fortalecer programas de seguridad vial y movilidad urbana.',
    solutions: [
      {
        title: 'Levantamiento de señales verticales',
        description:
          'Registramos ubicación, tipología, contenido y soporte de cada señal para construir un padrón confiable de activos en vía pública.',
      },
      {
        title: 'Evaluación de estado y visibilidad',
        description:
          'Identificamos señales dañadas, obstruidas o fuera de norma para priorizar reposición, limpieza y mejora de legibilidad.',
      },
      {
        title: 'Planeación de reposición y cobertura',
        description:
          'Entregamos mapas y listados operativos para cerrar vacíos de cobertura y programar mantenimiento por corredor o zona urbana.',
      },
    ],
  },
  {
    slug: 'luminarias-y-postes',
    title: 'Luminarias y postes',
    image: '/inventrees/inventario-luminarias-postes.png',
    imageAlt: 'Imagen de referencia para inventario de luminarias y postes',
    mediaLabel: 'Infraestructura de alumbrado y soporte urbano.',
    description:
      'La presencia de postes que soportan funciones de utilidad para diversos servicios en la ciudad, como la iluminación de espacios públicos o el tendido de cables y montaje de cámaras de vigilancia, requiere una gestión  con base en un inventario que brinde información sobre su ubicación, función, y estado físico y funcional.',
    sectionIntro:
      'Levantamos y estructuramos inventarios de luminarias y postes para mejorar control patrimonial, mantenimiento preventivo y evaluación de cobertura de servicios urbanos.',
    solutions: [
      {
        title: 'Inventario de postes y luminarias',
        description:
          'Registramos ubicación, tipo de poste, brazo, luminaria y función asociada para consolidar la infraestructura existente en un solo sistema.',
      },
      {
        title: 'Diagnóstico físico y funcional',
        description:
          'Evaluamos condición estructural, operación y compatibilidad del activo para detectar riesgos, fallas y necesidades de intervención.',
      },
      {
        title: 'Mapeo de cobertura y prioridades',
        description:
          'Construimos mapas para analizar cobertura, zonas críticas y prioridades de mantenimiento o ampliación del servicio.',
      },
    ],
  },
]

function InventreesSectionVideo({ src }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || !src) {
      return undefined
    }

    const normalizedSrc = src.trim()
    const isHlsSource = normalizedSrc.toLowerCase().includes('.m3u8')
    let hlsInstance = null

    if (isHlsSource) {
      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = normalizedSrc
      } else if (Hls.isSupported()) {
        hlsInstance = new Hls()
        hlsInstance.loadSource(normalizedSrc)
        hlsInstance.attachMedia(videoElement)
      } else {
        videoElement.removeAttribute('src')
      }
    } else {
      videoElement.src = normalizedSrc
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy()
      }
    }
  }, [src])

  return (
    <video className="inventrees-section-video" ref={videoRef} controls preload="metadata" playsInline>
      Tu navegador no puede reproducir este video. Intenta abrir esta pagina en otro navegador o actualiza Firefox.
    </video>
  )
}

function InventreesProyectos() {
  const location = useLocation()
  const [initialPolygonRegistration] = useState(() => readPolygonRegistration())
  const initialRegisteredPolygonFileName = getRegisteredPolygonFileName(initialPolygonRegistration)
  const polygonUploadInputRef = useRef(null)
  const [polygonFile, setPolygonFile] = useState(() => buildAttachmentFileFromRegistration(initialPolygonRegistration))
  const [registeredPolygonFileName, setRegisteredPolygonFileName] = useState(initialRegisteredPolygonFileName)
  const [polygonStatus, setPolygonStatus] = useState(() => initialPolygonRegistration.status)
  const [uploadStatus, setUploadStatus] = useState(() => (initialRegisteredPolygonFileName ? 'success' : 'idle'))
  const [uploadMessage, setUploadMessage] = useState(() =>
    initialRegisteredPolygonFileName ? `Archivo registrado disponible: ${initialRegisteredPolygonFileName}.` : 'No hay archivo cargado.',
  )
  const [quoteNotice, setQuoteNotice] = useState(null)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
  const [selectedServices, setSelectedServices] = useState(() => ({
    geolocalizacion: [],
    medicion: [],
    caracterizacion: [],
  }))
  const [clientForm, setClientForm] = useState({
    nombre: '',
    puestoFuncion: '',
    dependenciaGobierno: '',
    telefonoContacto: '',
    correoElectronico: '',
  })

  useEffect(() => {
    const storagePayload = readProjectQuotePrefill()
    const statePrefill = location.state?.prefillClientForm
    const storagePrefill = storagePayload?.clientForm
    const candidatePrefill = statePrefill && typeof statePrefill === 'object' ? statePrefill : storagePrefill
    const statePolygonPrefill = location.state?.prefillPolygonRegistration
    const storagePolygonPrefill = storagePayload?.polygonRegistration
    const candidatePolygonPrefill =
      statePolygonPrefill && typeof statePolygonPrefill === 'object'
        ? statePolygonPrefill
        : storagePolygonPrefill && typeof storagePolygonPrefill === 'object'
          ? storagePolygonPrefill
          : null

    let anyPrefillApplied = false

    if (candidatePrefill && typeof candidatePrefill === 'object') {
      setClientForm((previousValue) => ({
        ...previousValue,
        nombre: typeof candidatePrefill.nombre === 'string' ? candidatePrefill.nombre : previousValue.nombre,
        puestoFuncion:
          typeof candidatePrefill.puestoFuncion === 'string'
            ? candidatePrefill.puestoFuncion
            : previousValue.puestoFuncion,
        dependenciaGobierno:
          typeof candidatePrefill.dependenciaGobierno === 'string'
            ? candidatePrefill.dependenciaGobierno
            : previousValue.dependenciaGobierno,
        telefonoContacto:
          typeof candidatePrefill.telefonoContacto === 'string'
            ? candidatePrefill.telefonoContacto
            : previousValue.telefonoContacto,
        correoElectronico:
          typeof candidatePrefill.correoElectronico === 'string'
            ? candidatePrefill.correoElectronico
            : previousValue.correoElectronico,
      }))
      anyPrefillApplied = true
    }

    if (candidatePolygonPrefill) {
      const normalizedPolygonPrefill = {
        ...candidatePolygonPrefill,
        status:
          candidatePolygonPrefill.status === 'registered' ||
          Boolean(candidatePolygonPrefill?.polygonAttachment) ||
          (Array.isArray(candidatePolygonPrefill?.polygon) && candidatePolygonPrefill.polygon.length >= 3)
            ? 'registered'
            : 'pending',
        updatedAt: new Date().toISOString(),
      }

      persistPolygonRegistration(normalizedPolygonPrefill)

      const prefilledPolygonFile = buildAttachmentFileFromRegistration(normalizedPolygonPrefill)
      const prefilledPolygonFileName = getRegisteredPolygonFileName(normalizedPolygonPrefill)

      setPolygonFile(prefilledPolygonFile)
      setRegisteredPolygonFileName(prefilledPolygonFileName)
      setPolygonStatus(normalizedPolygonPrefill.status)
      setUploadStatus(prefilledPolygonFileName ? 'success' : 'idle')
      setUploadMessage(
        prefilledPolygonFileName
          ? `Archivo registrado disponible: ${prefilledPolygonFileName}.`
          : 'No hay archivo cargado.',
      )

      anyPrefillApplied = true
    }

    if (!anyPrefillApplied) {
      return
    }

    setQuoteNotice({
      type: 'success',
      text: 'Se recuperaron los datos del cliente y el polígono desde el cotizador de software para continuar la cotización de proyecto.',
    })

    clearProjectQuotePrefill()
  }, [location.state])

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const targetId = location.hash.replace('#', '')
    if (!targetId) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 40)

    return () => window.clearTimeout(timeoutId)
  }, [location.hash])

  const handlePolygonFileUpload = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!isSupportedPolygonFile(selectedFile.name)) {
      setPolygonFile(null)
      setRegisteredPolygonFileName(null)
      setPolygonStatus('pending')
      setUploadStatus('error')
      setUploadMessage('Formato no soportado. Use SHP en ZIP, KML o GeoJSON.')
      setQuoteNotice(null)
      return
    }

    if (selectedFile.size > maxQuoteUploadSizeBytes) {
      setPolygonFile(null)
      setRegisteredPolygonFileName(null)
      setPolygonStatus('pending')
      setUploadStatus('error')
      setUploadMessage(
        `El archivo excede el límite permitido (${formatFileSizeMb(selectedFile.size)} MB). Use un archivo menor a ${formatFileSizeMb(maxQuoteUploadSizeBytes)} MB.`,
      )
      setQuoteNotice(null)
      return
    }

    setPolygonFile(selectedFile)
    setRegisteredPolygonFileName(selectedFile.name)
    setPolygonStatus('registered')
    setUploadStatus('success')
    setUploadMessage(`Archivo registrado disponible: ${selectedFile.name}.`)
    setQuoteNotice(null)
  }

  const handleClearPolygon = () => {
    const previousRegistration = readPolygonRegistration()
    persistPolygonRegistration({
      ...previousRegistration,
      status: 'pending',
      polygon: null,
      roadLengthKm: null,
      polygonAttachment: null,
      polygonFileName: null,
      polygonSource: null,
      updatedAt: new Date().toISOString(),
    })

    setPolygonFile(null)
    setRegisteredPolygonFileName(null)
    setPolygonStatus('pending')
    setUploadStatus('idle')
    setUploadMessage('No hay archivo cargado.')
    setQuoteNotice(null)

    if (polygonUploadInputRef.current) {
      polygonUploadInputRef.current.value = ''
    }
  }

  const handleServiceOptionToggle = (panelId, optionId) => {
    setSelectedServices((previousValue) => {
      const panelSelections = previousValue[panelId] ?? []
      const alreadySelected = panelSelections.includes(optionId)

      return {
        ...previousValue,
        [panelId]: alreadySelected
          ? panelSelections.filter((item) => item !== optionId)
          : [...panelSelections, optionId],
      }
    })
  }

  const handleClientFieldChange = (event) => {
    const { name, value } = event.target
    setClientForm((previousValue) => ({
      ...previousValue,
      [name]: value,
    }))
  }

  const buildPanelSelectionSummary = (panel) => {
    const selectedOptionIds = selectedServices[panel.id] ?? []
    const selectedLabels = panel.options
      .filter((option) => selectedOptionIds.includes(option.id))
      .map((option) => option.label)

    if (!selectedLabels.length) {
      return `${panel.title}: Sin selección`
    }

    return `${panel.title}: ${selectedLabels.join(', ')}`
  }

  const buildSelectedServicesPayload = () => {
    return quoteServicePanels.map((panel) => {
      const selectedOptionIds = selectedServices[panel.id] ?? []
      const selectedOptions = panel.options
        .filter((option) => selectedOptionIds.includes(option.id))
        .map((option) => option.label)

      return {
        id: panel.id,
        title: panel.title,
        selectedOptions,
      }
    })
  }

  const handleRequestQuote = async (event) => {
    event.preventDefault()

    if (isSubmittingQuote) {
      return
    }

    if (!polygonFile) {
      setQuoteNotice({
        type: 'error',
        text: 'Debe registrar el archivo del polígono antes de solicitar la cotización.',
      })
      return
    }

    if (polygonFile.size > maxQuoteUploadSizeBytes) {
      setQuoteNotice({
        type: 'error',
        text: `El archivo del polígono es demasiado grande (${formatFileSizeMb(polygonFile.size)} MB). El límite es ${formatFileSizeMb(maxQuoteUploadSizeBytes)} MB.`,
      })
      return
    }

    const selectedOptionsCount = Object.values(selectedServices).reduce(
      (total, currentPanelSelections) => total + currentPanelSelections.length,
      0,
    )

    if (selectedOptionsCount < 1) {
      setQuoteNotice({
        type: 'error',
        text: 'Seleccione al menos un atributo para el inventario antes de solicitar la cotización.',
      })
      return
    }

    const requiredFields = [
      clientForm.nombre,
      clientForm.puestoFuncion,
      clientForm.dependenciaGobierno,
      clientForm.telefonoContacto,
      clientForm.correoElectronico,
    ]

    if (requiredFields.some((field) => !field.trim())) {
      setQuoteNotice({
        type: 'error',
        text: 'Complete todos los datos del cliente para preparar la solicitud.',
      })
      return
    }

    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientForm.correoElectronico.trim())
    if (!emailLooksValid) {
      setQuoteNotice({
        type: 'error',
        text: 'Ingrese un correo electrónico válido.',
      })
      return
    }

    const subject = 'Solicitud de Cotización - Proyecto INVENTREES'
    const bodyLines = [
      'Hola,',
      '',
      'Solicito una cotización de proyecto con la siguiente información:',
      '',
      'Datos del cliente:',
      `Nombre: ${clientForm.nombre.trim()}`,
      `Cargo o función: ${clientForm.puestoFuncion.trim()}`,
      `Dependencia de gobierno: ${clientForm.dependenciaGobierno.trim()}`,
      `Teléfono de contacto: ${clientForm.telefonoContacto.trim()}`,
      `Correo electrónico: ${clientForm.correoElectronico.trim()}`,
      '',
      'Paneles seleccionados:',
      ...quoteServicePanels.map((panel) => buildPanelSelectionSummary(panel)),
      '',
      `Total de opciones seleccionadas: ${selectedOptionsCount}`,
      `Archivo del polígono: ${polygonFile.name}`,
      '',
      'Saludos.',
    ]

    const body = bodyLines.join('\n')

    const formData = new FormData()
    formData.append('nombre', clientForm.nombre.trim())
    formData.append('cargoFuncion', clientForm.puestoFuncion.trim())
    formData.append('dependenciaGobierno', clientForm.dependenciaGobierno.trim())
    formData.append('telefonoContacto', clientForm.telefonoContacto.trim())
    formData.append('correoElectronico', clientForm.correoElectronico.trim())
    formData.append('polygonFile', polygonFile, polygonFile.name)
    formData.append('selectedServices', JSON.stringify(buildSelectedServicesPayload()))
    formData.append('selectedOptionsCount', String(selectedOptionsCount))
    formData.append('subjectPreview', subject)
    formData.append('bodyPreview', body)
    formData.append('recipientPreview', quoteRecipientEmail)
    formData.append('sourcePage', '/servicios/proyectos/inventrees-proyectos#cotizacion-proyecto')

    setIsSubmittingQuote(true)

    try {
      const response = await fetch(quoteApiUrl, {
        method: 'POST',
        body: formData,
      })

      const responseData = await response.json().catch(() => null)

      if (!response.ok) {
        let message =
          typeof responseData?.error === 'string' && responseData.error.trim()
            ? responseData.error
            : 'No fue posible enviar la solicitud en este momento.'

        if (response.status === 404) {
          message =
            'El servicio de cotización no está publicado todavía. Configure y despliegue el endpoint en Cloudflare Pages Functions o defina VITE_QUOTE_API_URL con la URL activa del endpoint.'
        } else if (response.status === 413) {
          message =
            `El archivo del polígono supera el límite de carga permitido por el servidor. Reduzca el archivo y use menos de ${formatFileSizeMb(maxQuoteUploadSizeBytes)} MB.`
        } else if (response.status === 401 || response.status === 403) {
          message = 'El servicio rechazó la solicitud. Revise API key y variables de entorno en Cloudflare.'
        } else if (response.status >= 500) {
          message = 'El servicio de cotización tuvo un error interno. Revise logs de Cloudflare Functions.'
        }

        setQuoteNotice({
          type: 'error',
          text: message,
        })
        return
      }

      setQuoteNotice({
        type: 'success',
        text: 'Solicitud enviada. Terralógica recibió su información y el archivo del polígono. En breve nos comunicaremos con usted al correo que proporcionó',
      })
    } catch {
      setQuoteNotice({
        type: 'error',
        text: 'No fue posible conectar con el servicio de cotización. Intente nuevamente.',
      })
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  const polygonStatusMessage = polygonStatus === 'registered' ? 'Polígono registrado' : 'Polígono no registrado'
  const filePickerLabel = polygonFile?.name || registeredPolygonFileName || 'Ningún archivo seleccionado'

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
          <h1>
            INVENTREES
          </h1>
          <p className="hero-text">
            Hace diez años desarrollamos una metodología para la gestión de inventarios urbanos que emplea imágenes de nivel de calle.
            <br />
            La llamamos INVENTREES (/ˈɪn.vənˌtɔːr.iːz/ = inventories = inventarios).
          </p>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading planeacion-projects-heading">
          <p className="eyebrow">INVENTREES</p>
          <h2>¿Qué inventario necesita?</h2>
          <p className="inventrees-intro-note">
            Los inventarios de activos urbanos son indispensables para las operaciones de manejo, mantenimiento y
            planificación requeridas para administrar adecuadamente los servicios que brindan a la ciudadanía.
          </p>
        </div>
        <div className="identity-grid inventrees-panels-grid">
          {inventreesProjectTypes.map((projectType) => (
            <article key={projectType.slug} className="identity-card">
              <a className="planeacion-project-image-link" href={`#${projectType.slug}`} aria-label={`Ir a la sección ${projectType.title}`}>
                <img
                  className="inventrees-panel-image"
                  src={projectType.image}
                  alt={projectType.imageAlt}
                  loading="lazy"
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
          {inventreesProjectTypes.map((projectType) => (
            <article key={projectType.slug} id={projectType.slug} className="amenaza-section-card">
              <header className="amenaza-section-header">
                <div className="amenazas-media-shell" aria-hidden="true">
                  <img
                    className="amenazas-media-image"
                    src={projectType.image}
                    alt=""
                    loading="lazy"
                  />
                  <div className="amenazas-media-overlay" />
                  <p className="amenazas-media-kicker">{projectType.mediaLabel}</p>
                </div>
                <div className="amenaza-section-copy">
                  <p className="eyebrow">Sección {projectType.title}</p>
                  <h3>{projectType.title}</h3>
                  <p>{projectType.sectionIntro}</p>
                </div>
              </header>

              <div className="amenaza-solutions-grid">
                {projectType.solutions.map((solution) => (
                  <article key={solution.title} className="amenaza-solution-card">
                    <h4>{solution.title}</h4>
                    <p>{solution.description}</p>
                  </article>
                ))}
              </div>

              {projectType.videoSrc ? (
                <div className="inventrees-section-video-block">
                  <InventreesSectionVideo src={projectType.videoSrc} />
                </div>
              ) : null}

              {projectType.postVideoTextBeforeLink ? (
                <p className="inventrees-section-followup-text">
                  {projectType.postVideoTextBeforeLink}
                  {projectType.postVideoLinkTo ? (
                    <Link className="inventrees-inline-link" to={projectType.postVideoLinkTo}>
                      {projectType.postVideoLinkText}
                    </Link>
                  ) : (
                    projectType.postVideoLinkText
                  )}
                  {projectType.postVideoTextAfterLink}
                </p>
              ) : null}

              {projectType.slug === 'arbolado-publico' ? (
                <div id="cotizacion-proyecto" className="inventrees-quote-project-block">
                  <h4 className="inventrees-quote-project-title">Cotización de Proyecto</h4>

                  <div className="identity-card inventory-requirements-card inventrees-quote-requirements-card">
                    <p>
                      El cliente debe proporcionar una capa de polígonos que delimite el área para la cual se solicita la licencia.
                    </p>
                    <p>
                      Formatos aceptados: SHP (archivos comprimidos en ZIP), KML o GeoJSON (tamaño máximo 9Mb). También lo puede generar <Link className="inventory-highlight-link" to="/servicios/software/inventrees/poligono" state={{ returnTo: '/servicios/proyectos/inventrees-proyectos', returnHash: 'cotizacion-proyecto' }}>AQUÍ</Link>.
                    </p>

                    <div className="inventory-file-upload">
                      <span>Subir archivo del polígono</span>
                      <div className="inventory-file-picker">
                        <button
                          type="button"
                          className="inventory-file-picker-button"
                          onClick={() => polygonUploadInputRef.current?.click()}
                        >
                          Elegir archivo
                        </button>
                        <span className="inventory-file-picker-name">{filePickerLabel}</span>
                      </div>
                      <input
                        ref={polygonUploadInputRef}
                        id="project-polygon-upload"
                        className="inventory-file-upload-input"
                        type="file"
                        accept=".zip,.kml,.geojson,.json"
                        onChange={handlePolygonFileUpload}
                      />
                    </div>

                    <p className={`inventory-upload-message inventory-upload-message-${uploadStatus}`}>{uploadMessage}</p>

                    <div className="inventory-polygon-actions">
                      <div className={`inventory-polygon-status inventory-polygon-status-${polygonStatus}`}>
                        {polygonStatusMessage}
                      </div>
                      {polygonStatus === 'registered' ? (
                        <button type="button" className="inventory-clear-polygon-btn" onClick={handleClearPolygon}>
                          Borrar polígono
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <p className="inventrees-quote-feature-panels-intro">
                    Por favor seleccione los atributos que necesita incluir en su inventario.
                  </p>

                  <div className="inventrees-quote-feature-panels" aria-label="Selección de servicios para cotización">
                    {quoteServicePanels.map((panel) => {
                      const panelSelections = selectedServices[panel.id] ?? []
                      return (
                        <article key={panel.id} className="inventrees-quote-feature-panel">
                          <h5>{panel.title}</h5>
                          <ul>
                            {panel.options.map((option) => (
                              <li key={option.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={panelSelections.includes(option.id)}
                                    onChange={() => handleServiceOptionToggle(panel.id, option.id)}
                                  />
                                  <span>{option.label}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </article>
                      )
                    })}
                  </div>

                  <form className="inventrees-quote-client-form" onSubmit={handleRequestQuote}>
                    <h5>Datos del cliente</h5>
                    <div className="inventrees-quote-client-form-grid">
                      <label className="inventory-field">
                        <span>Nombre</span>
                        <input
                          type="text"
                          name="nombre"
                          value={clientForm.nombre}
                          onChange={handleClientFieldChange}
                          autoComplete="name"
                          required
                        />
                      </label>

                      <label className="inventory-field">
                        <span>Cargo o función</span>
                        <input
                          type="text"
                          name="puestoFuncion"
                          value={clientForm.puestoFuncion}
                          onChange={handleClientFieldChange}
                          required
                        />
                      </label>

                      <label className="inventory-field">
                        <span>Dependencia de gobierno</span>
                        <input
                          type="text"
                          name="dependenciaGobierno"
                          value={clientForm.dependenciaGobierno}
                          onChange={handleClientFieldChange}
                          required
                        />
                      </label>

                      <label className="inventory-field">
                        <span>Teléfono de contacto</span>
                        <input
                          type="tel"
                          name="telefonoContacto"
                          value={clientForm.telefonoContacto}
                          onChange={handleClientFieldChange}
                          autoComplete="tel"
                          required
                        />
                      </label>

                      <label className="inventory-field">
                        <span>Correo electrónico</span>
                        <input
                          type="email"
                          name="correoElectronico"
                          value={clientForm.correoElectronico}
                          onChange={handleClientFieldChange}
                          autoComplete="email"
                          required
                        />
                      </label>
                    </div>

                    <button type="submit" className="inventrees-quote-submit-btn" disabled={isSubmittingQuote}>
                      {isSubmittingQuote ? 'Enviando solicitud...' : 'Solicitar Cotización'}
                    </button>

                    {quoteNotice ? (
                      <p className={`inventrees-quote-notice inventrees-quote-notice-${quoteNotice.type}`}>
                        {quoteNotice.text}
                      </p>
                    ) : null}
                  </form>
                </div>
              ) : null}

              {projectType.featuredProjectsTitle ? (
                <div className="inventrees-featured-projects-block">
                  <h4 className="inventrees-featured-projects-title">{projectType.featuredProjectsTitle}</h4>
                  {projectType.featuredProjectsNotes?.map((note, noteIndex) => (
                    <div
                      key={note}
                      className={`inventrees-featured-project-row${noteIndex % 2 === 1 ? ' inventrees-featured-project-row-reverse' : ''}`}
                    >
                      <div className="inventrees-featured-projects-copy">
                        {projectType.featuredProjectsSectionHeadings?.[noteIndex] ? (
                          <h5 className="inventrees-featured-projects-section-heading">
                            {projectType.featuredProjectsSectionHeadings[noteIndex]}
                          </h5>
                        ) : null}
                        <p className="inventrees-featured-projects-note">{note}</p>
                      </div>
                      {noteIndex === 0 && projectType.featuredProjectsImage ? (
                        <a
                          className="inventrees-featured-projects-media"
                          href="https://ciga-unam.maps.arcgis.com/apps/instant/atlas/index.html?appid=98b26ca5a3f8426780b53694250309e4&webmap=8b248dc3cea0495c8c5071c6656d1e35&locale=es"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir ARBOLADO PUBLICO URBANO DE LA ZONA METROPOLITANA DE GUADALAJARA"
                        >
                          <img
                            className="inventrees-featured-projects-image"
                            src={projectType.featuredProjectsImage}
                            alt={projectType.featuredProjectsImageAlt}
                            loading="lazy"
                          />
                        </a>
                      ) : null}
                      {noteIndex === 1 && projectType.featuredProjectsSecondImage ? (
                        <a
                          className="inventrees-featured-projects-media"
                          href={projectType.featuredProjectsSecondImageLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={projectType.featuredProjectsSecondImageLabel}
                        >
                          <img
                            className="inventrees-featured-projects-image"
                            src={projectType.featuredProjectsSecondImage}
                            alt={projectType.featuredProjectsSecondImageAlt}
                            loading="lazy"
                          />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default InventreesProyectos