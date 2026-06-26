import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hls from 'hls.js'
import shp from 'shpjs'
import { kml as kmlToGeoJSON } from '@tmcw/togeojson'
import './App.css'

const polygonStorageKey = 'inventrees-polygon-registration'

const licenseOptions = [
  {
    id: 'small-monthly',
    label: 'Suscripción mensual para comunidades pequeñas',
  },
  {
    id: 'monthly-medium-large',
    label: 'Suscripción mensual para ciudades medias y grandes',
  },
  {
    id: 'permanent-medium-large',
    label: 'Licencia permanente para ciudades medias y grandes',
  },
]

const plansByModule = [
  {
    id: 'geolocalizador',
    name: 'Geolocalizador',
    plans: [
      {
        licenseId: 'small-monthly',
        type: 'Suscripción mensual para comunidades pequeñas',
        price: 'USD 0.50 por km de vialidad',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.5,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 350.00 mensuales',
        range: 'A partir de 500 km',
        mode: 'flat-monthly',
        flatAmount: 350,
        minKm: 500,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.00 por km de vialidad',
        range: 'Desde 10,000 km en adelante',
        mode: 'rate',
        rate: 1,
        minKm: 10000,
      },
    ],
  },
  {
    id: 'medidor',
    name: 'Medidor',
    plans: [
      {
        licenseId: 'small-monthly',
        type: 'Suscripción mensual para comunidades pequeñas',
        price: 'USD 0.75 por km de vialidad',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.75,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 400.00 mensuales',
        range: 'A partir de 500 km',
        mode: 'flat-monthly',
        flatAmount: 400,
        minKm: 500,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.50 por km de vialidad',
        range: 'Desde 10,000 km en adelante',
        mode: 'rate',
        rate: 1.5,
        minKm: 10000,
      },
    ],
  },
  {
    id: 'caracterizador',
    name: 'Caracterizador',
    plans: [
      {
        licenseId: 'small-monthly',
        type: 'Suscripción mensual para comunidades pequeñas',
        price: 'USD 0.75 por km de vialidad',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.75,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 400.00 mensuales',
        range: 'A partir de 500 km',
        mode: 'flat-monthly',
        flatAmount: 400,
        minKm: 500,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.50 por km de vialidad',
        range: 'Desde 10,000 km en adelante',
        mode: 'rate',
        rate: 1.5,
        minKm: 10000,
      },
    ],
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
})

const contactEmail = 'info@terralogica.mx'

const introVideos = [
  {
    label: 'Geolocalizador',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/5e33222f0d842e505fbbde0cd1c5a43e/manifest/video.m3u8',
  },
  {
    label: 'Medidor',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/7a612d900ce0f73a0090525603f4235c/manifest/video.m3u8',
  },
  {
    label: 'Caracterizador',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/1c000c5fad5fd0d9a7dcb04adcce4907/manifest/video.m3u8',
  },
]

function readPolygonRegistration() {
  try {
    const rawValue = window.localStorage.getItem(polygonStorageKey)
    if (!rawValue) {
      return {
        status: 'pending',
        roadLengthKm: null,
        polygon: null,
        polygonAttachment: null,
      }
    }

    const parsedValue = JSON.parse(rawValue)
    return {
      ...parsedValue,
      status: parsedValue?.status === 'registered' ? 'registered' : 'pending',
      roadLengthKm: Number.isFinite(Number(parsedValue?.roadLengthKm)) ? Number(parsedValue.roadLengthKm) : null,
      polygon: Array.isArray(parsedValue?.polygon) ? parsedValue.polygon : null,
      polygonAttachment: parsedValue?.polygonAttachment ?? null,
    }
  } catch {
    return {
      status: 'pending',
      roadLengthKm: null,
      polygon: null,
      polygonAttachment: null,
    }
  }
}

function writePolygonRegistration(nextValue) {
  window.localStorage.setItem(polygonStorageKey, JSON.stringify(nextValue))
}

function arrayBufferToBase64(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer)
  let binaryString = ''
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize)
    binaryString += String.fromCharCode(...chunk)
  }

  return window.btoa(binaryString)
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

function toAttachmentPayload({ name, mimeType, data, encoding = 'text' }) {
  return {
    name,
    mimeType,
    data,
    encoding,
  }
}

function normalizeGeoJSON(input) {
  if (!input || typeof input !== 'object') {
    return null
  }

  if (input.type === 'FeatureCollection' && Array.isArray(input.features)) {
    return input
  }

  if (input.type === 'Feature' && input.geometry) {
    return {
      type: 'FeatureCollection',
      features: [input],
    }
  }

  if (input.type && input.coordinates) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: input,
        },
      ],
    }
  }

  return null
}

function ringAreaValue(ring) {
  if (!Array.isArray(ring) || ring.length < 3) {
    return 0
  }

  let areaValue = 0

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index]
    const next = ring[(index + 1) % ring.length]
    areaValue += current[0] * next[1] - next[0] * current[1]
  }

  return Math.abs(areaValue / 2)
}

function extractMainPolygonRing(geojson) {
  if (!geojson || geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    return null
  }

  let bestRing = null
  let bestArea = 0

  for (const feature of geojson.features) {
    const geometry = feature?.geometry
    if (!geometry) {
      continue
    }

    if (geometry.type === 'Polygon' && Array.isArray(geometry.coordinates) && geometry.coordinates[0]) {
      const areaValue = ringAreaValue(geometry.coordinates[0])
      if (areaValue > bestArea) {
        bestArea = areaValue
        bestRing = geometry.coordinates[0]
      }
      continue
    }

    if (geometry.type === 'MultiPolygon' && Array.isArray(geometry.coordinates)) {
      for (const polygon of geometry.coordinates) {
        const ring = Array.isArray(polygon) ? polygon[0] : null
        if (!ring) {
          continue
        }

        const areaValue = ringAreaValue(ring)
        if (areaValue > bestArea) {
          bestArea = areaValue
          bestRing = ring
        }
      }
    }
  }

  return bestRing
}

function toLatLngPolygonFromLonLatRing(ring) {
  if (!Array.isArray(ring)) {
    return null
  }

  const coordinates = ring
    .filter((point) => Array.isArray(point) && point.length >= 2)
    .map(([lon, lat]) => [Number(lat), Number(lon)])
    .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon))

  if (coordinates.length < 3) {
    return null
  }

  const first = coordinates[0]
  const last = coordinates[coordinates.length - 1]
  if (first[0] === last[0] && first[1] === last[1] && coordinates.length > 3) {
    return coordinates.slice(0, -1)
  }

  return coordinates
}

async function parsePolygonFile(file) {
  const lowerName = file.name.toLowerCase()

  if (lowerName.endsWith('.zip')) {
    const arrayBuffer = await file.arrayBuffer()
    const geo = await shp(arrayBuffer)
    const normalizedGeo = normalizeGeoJSON(geo)
    if (!normalizedGeo) {
      throw new Error('No se encontró una capa válida dentro del ZIP de SHP.')
    }

    const ring = extractMainPolygonRing(normalizedGeo)
    const polygon = toLatLngPolygonFromLonLatRing(ring)
    if (!polygon) {
      throw new Error('El archivo ZIP no contiene un polígono válido.')
    }

    return {
      polygon,
      format: 'SHP (ZIP)',
      attachment: toAttachmentPayload({
        name: file.name,
        mimeType: 'application/zip',
        data: arrayBufferToBase64(arrayBuffer),
        encoding: 'base64',
      }),
    }
  }

  if (lowerName.endsWith('.kml')) {
    const text = await file.text()
    const xmlDocument = new DOMParser().parseFromString(text, 'application/xml')
    const parserError = xmlDocument.querySelector('parsererror')
    if (parserError) {
      throw new Error('El archivo KML no tiene un formato XML válido.')
    }

    const normalizedGeo = normalizeGeoJSON(kmlToGeoJSON(xmlDocument))
    const ring = extractMainPolygonRing(normalizedGeo)
    const polygon = toLatLngPolygonFromLonLatRing(ring)
    if (!polygon) {
      throw new Error('El archivo KML no contiene un polígono válido.')
    }

    return {
      polygon,
      format: 'KML',
      attachment: toAttachmentPayload({
        name: file.name,
        mimeType: 'application/vnd.google-earth.kml+xml',
        data: text,
      }),
    }
  }

  if (lowerName.endsWith('.geojson') || lowerName.endsWith('.json')) {
    const text = await file.text()
    let parsedJSON

    try {
      parsedJSON = JSON.parse(text)
    } catch {
      throw new Error('El archivo GeoJSON no es un JSON válido.')
    }

    const normalizedGeo = normalizeGeoJSON(parsedJSON)
    const ring = extractMainPolygonRing(normalizedGeo)
    const polygon = toLatLngPolygonFromLonLatRing(ring)
    if (!polygon) {
      throw new Error('El archivo GeoJSON no contiene un polígono válido.')
    }

    return {
      polygon,
      format: 'GeoJSON',
      attachment: toAttachmentPayload({
        name: file.name,
        mimeType: 'application/geo+json',
        data: text,
      }),
    }
  }

  throw new Error('Formato no soportado. Use SHP en ZIP, KML o GeoJSON.')
}

function formatKmLimit(value) {
  return new Intl.NumberFormat('es-MX').format(value)
}

function parseKmInput(value) {
  if (typeof value !== 'string') {
    return Number.NaN
  }

  const normalizedValue = value.replace(/,/g, '')
  const parsedValue = Number(normalizedValue)
  return Number.isFinite(parsedValue) ? parsedValue : Number.NaN
}

function formatKmInputValue(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const cleanedValue = value.replace(/,/g, '').replace(/[^\d.]/g, '')
  if (!cleanedValue) {
    return ''
  }

  const hasDecimalPoint = cleanedValue.includes('.')
  const [rawIntegerPart, ...decimalParts] = cleanedValue.split('.')
  const integerDigits = rawIntegerPart.replace(/^0+(?=\d)/, '')
  const normalizedInteger = integerDigits || '0'
  const formattedInteger = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(normalizedInteger))

  if (!hasDecimalPoint) {
    return formattedInteger
  }

  const decimalDigits = decimalParts.join('').slice(0, 2)
  return `${formattedInteger}.${decimalDigits}`
}

function formatInitialKmValue(value) {
  if (!Number.isFinite(value)) {
    return ''
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function getRecommendedLicenseId(km) {
  if (!Number.isFinite(km) || km <= 0) {
    return null
  }

  if (km <= 500) {
    return 'small-monthly'
  }

  if (km >= 10000) {
    return 'permanent-medium-large'
  }

  return 'monthly-medium-large'
}

function calculateQuote(plan, km) {
  if (!Number.isFinite(km) || km <= 0) {
    return {
      status: 'pending',
      message: 'Ingrese un valor válido de km de vialidad para estimar el costo. Si no lo conoce con precisión usaremos un valor estimado en base en el polígono registrado arriba.',
    }
  }

  if (plan.maxKm !== undefined && km > plan.maxKm) {
    return {
      status: 'invalid',
      message: `Esta modalidad aplica hasta ${formatKmLimit(plan.maxKm)} km de vialidad.`,
    }
  }

  if (plan.minKm !== undefined && km < plan.minKm) {
    return {
      status: 'invalid',
      message: `Esta modalidad aplica a partir de ${formatKmLimit(plan.minKm)} km de vialidad.`,
    }
  }

  if (plan.mode === 'flat-monthly') {
    return {
      status: 'valid',
      amountLabel: `${currencyFormatter.format(plan.flatAmount)} / mes`,
      detail: 'Pago mensual estimado para la modalidad seleccionada.',
    }
  }

  const total = km * plan.rate

  return {
    status: 'valid',
    amountLabel: plan.billing === 'monthly' ? `${currencyFormatter.format(total)} / mes` : currencyFormatter.format(total),
    detail:
      plan.billing === 'monthly'
        ? `Pago mensual estimado con ${formatKmLimit(km)} km de vialidad a ${currencyFormatter.format(plan.rate)} por km.`
        : `Estimado con ${formatKmLimit(km)} km de vialidad a ${currencyFormatter.format(plan.rate)} por km.`,
  }
}

function buildQuoteMailto({ moduleName, planType, kmValueText, amountLabel, recommendedLabel }) {
  const subject = `Solicitud de cotización INVENTREES - ${moduleName}`
  const body = [
    'Hola,',
    '',
    'Solicito una cotización para INVENTREES con la siguiente configuración:',
    `Módulo: ${moduleName}`,
    `Licencia seleccionada: ${planType}`,
    `Km de vialidad: ${kmValueText}`,
    `Estimado mostrado: ${amountLabel}`,
    `Licencia recomendada por el cotizador: ${recommendedLabel ?? 'No disponible'}`,
    '',
    'Adjuntaremos la capa de polígonos requerida en formato SHP (ZIP), KML o GeoJSON.',
    '',
    'Quedo atento(a) a su propuesta.',
  ].join('\n')

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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

function downloadFile(file) {
  const downloadUrl = window.URL.createObjectURL(file)
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = file.name
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(downloadUrl)
}

function buildAttachmentFileFromRegistration(registration) {
  let attachmentFile = attachmentToFile(registration?.polygonAttachment)

  if (!attachmentFile && Array.isArray(registration?.polygon) && registration.polygon.length >= 3) {
    const polygonKmlText = polygonToKmlText(registration.polygon)
    if (polygonKmlText) {
      attachmentFile = new File([polygonKmlText], 'inventrees-poligono.kml', {
        type: 'application/vnd.google-earth.kml+xml',
      })
    }
  }

  return attachmentFile
}

function InventreesPlanes() {
  const navigate = useNavigate()
  const polygonRegistration = readPolygonRegistration()
  const initialKmValue =
    polygonRegistration.status === 'registered' &&
    Number.isFinite(polygonRegistration.roadLengthKm) &&
    polygonRegistration.roadLengthKm > 0
      ? polygonRegistration.roadLengthKm
      : null
  const initialRecommendedLicenseId = getRecommendedLicenseId(initialKmValue) ?? licenseOptions[0].id

  const [selectedModuleId, setSelectedModuleId] = useState(plansByModule[0].id)
  const [selectedLicenseId, setSelectedLicenseId] = useState(initialRecommendedLicenseId)
  const [kmValue, setKmValue] = useState(initialKmValue ? formatInitialKmValue(initialKmValue) : '')
  const [currentIntroVideoIndex, setCurrentIntroVideoIndex] = useState(0)
  const [isIntroVideoPlaying, setIsIntroVideoPlaying] = useState(true)
  const [polygonStatus, setPolygonStatus] = useState(() => polygonRegistration.status)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [uploadMessage, setUploadMessage] = useState('No hay archivo cargado.')
  const [quoteAttachmentMessage, setQuoteAttachmentMessage] = useState('')
  const introVideoRef = useRef(null)

  const polygonStatusMessage = polygonStatus === 'registered' ? 'Polígono registrado' : 'Polígono no registrado'

  const handleKmChange = (event) => {
    const nextKmValue = formatKmInputValue(event.target.value)
    const recommendedLicenseId = getRecommendedLicenseId(parseKmInput(nextKmValue))

    setKmValue(nextKmValue)

    if (recommendedLicenseId && recommendedLicenseId !== selectedLicenseId) {
      setSelectedLicenseId(recommendedLicenseId)
    }
  }

  const selectedModule = plansByModule.find((module) => module.id === selectedModuleId) ?? plansByModule[0]
  const selectedPlan =
    selectedModule.plans.find((plan) => plan.licenseId === selectedLicenseId) ?? selectedModule.plans[0]
  const parsedKm = parseKmInput(kmValue)
  const quote = calculateQuote(selectedPlan, parsedKm)
  const recommendedLicenseId = getRecommendedLicenseId(parsedKm)
  const recommendedOption = licenseOptions.find((option) => option.id === recommendedLicenseId) ?? null
  const currentRegistration = readPolygonRegistration()
  const hasPolygonForAttachment =
    Boolean(currentRegistration?.polygonAttachment) ||
    (Array.isArray(currentRegistration?.polygon) && currentRegistration.polygon.length >= 3)
  const quoteMailto =
    quote.status === 'valid'
      ? buildQuoteMailto({
          moduleName: selectedModule.name,
          planType: selectedPlan.type,
          kmValueText: formatKmLimit(parsedKm),
          amountLabel: quote.amountLabel,
          recommendedLabel: recommendedOption?.label,
        })
      : `mailto:${contactEmail}?subject=${encodeURIComponent('Solicitud de información INVENTREES')}`

  const handleRequestQuote = async (event) => {
    if (quote.status !== 'valid') {
      event.preventDefault()
      return
    }

    event.preventDefault()

    const attachmentFile = buildAttachmentFileFromRegistration(currentRegistration)

    if (attachmentFile && navigator.share && navigator.canShare?.({ files: [attachmentFile] })) {
      try {
        await navigator.share({
          title: `Solicitud de cotización INVENTREES - ${selectedModule.name}`,
          text: 'Se prepara el archivo del polígono para adjuntarlo a la solicitud.',
          files: [attachmentFile],
        })
        setQuoteAttachmentMessage(`Archivo preparado: ${attachmentFile.name}. Verifique que quede adjunto antes de enviar.`)
      } catch {
        setQuoteAttachmentMessage(
          `Gmail Web no adjunta archivos desde mailto. Se abrirá el correo y debe adjuntar manualmente: ${attachmentFile.name}.`,
        )
      }
    } else if (attachmentFile) {
      downloadFile(attachmentFile)
      setQuoteAttachmentMessage(
        `Se descargó ${attachmentFile.name}. En Gmail Web adjúntelo manualmente antes de enviar la cotización.`,
      )
    } else {
      setQuoteAttachmentMessage('No se encontró archivo de polígono para adjuntar en esta solicitud.')
    }

    window.location.href = quoteMailto
  }

  const handleDownloadPolygonAttachment = () => {
    const attachmentFile = buildAttachmentFileFromRegistration(currentRegistration)
    if (!attachmentFile) {
      setQuoteAttachmentMessage('No hay un polígono disponible para descargar.')
      return
    }

    downloadFile(attachmentFile)
    setQuoteAttachmentMessage(
      `Archivo descargado: ${attachmentFile.name}. Guárdelo y adjúntelo manualmente en su correo.`,
    )
  }

  const currentIntroVideo = introVideos[currentIntroVideoIndex]

  useEffect(() => {
    const videoElement = introVideoRef.current
    if (!videoElement) {
      return undefined
    }

    let hlsInstance = null

    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = currentIntroVideo.src
    } else if (Hls.isSupported()) {
      hlsInstance = new Hls()
      hlsInstance.loadSource(currentIntroVideo.src)
      hlsInstance.attachMedia(videoElement)
    } else {
      videoElement.src = currentIntroVideo.src
    }

    videoElement
      .play()
      .then(() => setIsIntroVideoPlaying(true))
      .catch(() => setIsIntroVideoPlaying(false))

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy()
      }
    }
  }, [currentIntroVideo.src])

  const handleIntroVideoEnded = () => {
    setIsIntroVideoPlaying(true)
    setCurrentIntroVideoIndex((previousIndex) => (previousIndex + 1) % introVideos.length)
  }

  const handleIntroVideoSelect = (index) => {
    if (index === currentIntroVideoIndex && introVideoRef.current) {
      if (introVideoRef.current.paused) {
        introVideoRef.current
          .play()
          .then(() => setIsIntroVideoPlaying(true))
          .catch(() => setIsIntroVideoPlaying(false))
      } else {
        introVideoRef.current.pause()
        setIsIntroVideoPlaying(false)
      }
      return
    }

    setIsIntroVideoPlaying(true)
    setCurrentIntroVideoIndex(index)
  }

  const handlePolygonFileUpload = async (event) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) {
      return
    }

    setUploadStatus('loading')
    setUploadMessage(`Validando archivo ${selectedFile.name}...`)

    try {
      const parsed = await parsePolygonFile(selectedFile)
      const currentRegistration = readPolygonRegistration()

      writePolygonRegistration({
        ...currentRegistration,
        status: 'pending',
        polygon: parsed.polygon,
        roadLengthKm: null,
        polygonSource: 'upload',
        polygonFileName: selectedFile.name,
        polygonFileFormat: parsed.format,
        polygonAttachment: parsed.attachment,
        updatedAt: new Date().toISOString(),
      })

      setPolygonStatus('pending')
      setUploadStatus('success')
      setUploadMessage(`Archivo válido (${parsed.format}). Se cargó un polígono para revisar en el mapa.`)
      navigate('/servicios/software/inventrees/poligono')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No fue posible procesar el archivo cargado.'
      setUploadStatus('error')
      setUploadMessage(errorMessage)
    }

    event.target.value = ''
  }

  const handleClearRegisteredPolygon = () => {
    const currentRegistration = readPolygonRegistration()

    writePolygonRegistration({
      ...currentRegistration,
      status: 'pending',
      polygon: null,
      roadLengthKm: null,
      polygonSource: null,
      polygonFileName: null,
      polygonFileFormat: null,
      polygonAttachment: null,
      updatedAt: new Date().toISOString(),
    })

    setPolygonStatus('pending')
    setKmValue('')
    setSelectedLicenseId(licenseOptions[0].id)
    setUploadStatus('idle')
    setUploadMessage('No hay archivo cargado.')
  }

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
            <Link to="/servicios/software">Software</Link>
          </nav>
        </header>

        <div className="hero-copy subpage-intro">
          <p className="eyebrow">INVENTREES</p>
          <div className="inventory-intro-video-block" aria-label="Demostración secuencial de módulos INVENTREES">
            <video
              ref={introVideoRef}
              className="inventory-intro-video"
              autoPlay
              muted
              playsInline
              preload="metadata"
              onEnded={handleIntroVideoEnded}
              onPlay={() => setIsIntroVideoPlaying(true)}
              onPause={() => setIsIntroVideoPlaying(false)}
            />
            <div className="inventory-intro-video-labels" aria-label="Selector de módulos de video">
              {introVideos.map((video, index) => (
                <button
                  type="button"
                  key={video.label}
                  className={`inventory-intro-video-chip${index === currentIntroVideoIndex ? ' is-active' : ''}${
                    index === currentIntroVideoIndex && !isIntroVideoPlaying ? ' is-paused' : ''
                  }`}
                  onClick={() => handleIntroVideoSelect(index)}
                  aria-pressed={index === currentIntroVideoIndex}
                >
                  {video.label}
                </button>
              ))}
            </div>
          </div>
          <h1>Crear y mantener su propio inventario de arbolado público urbano es ahora muy fácil!.</h1>
          <p className="hero-text">
            Estructura comercial flexible y equitativa para comunidades pequeñas, ciudades medias y grandes, con reglas claras por cobertura de km de vialidad.
          </p>
        </div>
      </section>

      <section className="services-section inventory-requirements-section">
        <div className="section-heading compact">
          <p className="eyebrow">Requisitos del cliente</p>
          <h2>Para cualquier licencia se requiere una capa de polígonos del área de interés.</h2>
        </div>
        <div className="identity-card inventory-requirements-card">
          <p>
            El cliente debe proporcionar una capa de polígonos que delimite el área para la cual se solicita la licencia.
          </p>
          <p>
            Formatos aceptados: SHP (archivos comprimidos en ZIP), KML o GeoJSON. También lo puede generar <Link to="/servicios/software/inventrees/poligono">aquí</Link>.
          </p>
          <label className="inventory-file-upload" htmlFor="inventory-polygon-upload">
            <span>Subir archivo del polígono</span>
            <input
              id="inventory-polygon-upload"
              type="file"
              accept=".zip,.kml,.geojson,.json"
              onChange={handlePolygonFileUpload}
            />
          </label>
          <p className={`inventory-upload-message inventory-upload-message-${uploadStatus}`}>{uploadMessage}</p>
          <div className="inventory-polygon-actions">
            <div className={`inventory-polygon-status inventory-polygon-status-${polygonStatus}`}>
              {polygonStatusMessage}
            </div>
            {polygonStatus === 'registered' ? (
              <button type="button" className="inventory-clear-polygon-btn" onClick={handleClearRegisteredPolygon}>
                Borrar polígono
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="services-section inventory-plans-section">
        <div className="section-heading compact">
          <p className="eyebrow">Cotizador rápido</p>
          <h2>Seleccione módulo, modalidad y km de vialidad para obtener un estimado inmediato.</h2>
        </div>

        <div className="identity-card inventory-quote-card">
          <div className="inventory-quote-grid">
            <label className="inventory-field">
              <span>Módulo</span>
              <select value={selectedModuleId} onChange={(event) => setSelectedModuleId(event.target.value)}>
                {plansByModule.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="inventory-field">
              <span>Tipo de licencia</span>
              <select value={selectedLicenseId} onChange={(event) => setSelectedLicenseId(event.target.value)}>
                {licenseOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="inventory-field">
              <span>Km de vialidad</span>
              <input
                type="text"
                inputMode="decimal"
                value={kmValue}
                onChange={handleKmChange}
                placeholder="Ej. 325 o 12,500"
              />
            </label>
          </div>

          <p className="inventory-threshold-note">
            <em>Nota:</em> para 500 km o menos, el cotizador recomienda la suscripción mensual para comunidades pequeñas. A partir de valores mayores a 500 km recomienda la suscripción mensual para ciudades medias y grandes.
          </p>

          <div className={`inventory-quote-result inventory-quote-result-${quote.status}`}>
            <p className="inventory-quote-title">{selectedModule.name}</p>
            <p className="inventory-quote-plan">{selectedPlan.type}</p>
            {quote.amountLabel ? <p className="inventory-quote-amount">{quote.amountLabel}</p> : null}
            <p className="inventory-quote-message">{quote.message ?? quote.detail}</p>
            {recommendedOption ? (
              <p className="inventory-quote-recommendation">
                Recomendación automática: {recommendedOption.label}
              </p>
            ) : null}
            <a
              className={`primary-link inventory-quote-cta${quote.status !== 'valid' ? ' inventory-quote-cta-disabled' : ''}`}
              href={quoteMailto}
              aria-disabled={quote.status !== 'valid'}
              onClick={handleRequestQuote}
            >
              Solicitar cotización
            </a>
            <button
              type="button"
              className="secondary-link inventory-quote-attachment-download"
              onClick={handleDownloadPolygonAttachment}
              disabled={!hasPolygonForAttachment}
            >
              Descargar archivo del polígono
            </button>
            {quoteAttachmentMessage ? <p className="inventory-quote-attachment-hint">{quoteAttachmentMessage}</p> : null}
          </div>
        </div>

        <div className="section-heading compact">
          <p className="eyebrow">Módulos y licencias</p>
          <h2>Cada módulo incluye tres modalidades de compra con precios y umbrales específicos.</h2>
          <p className="inventory-currency-note">Todos los precios se expresan en USD (dólares americanos).</p>
        </div>

        <div className="inventory-module-grid">
          {plansByModule.map((module) => (
            <article key={module.name} className="identity-card inventory-module-card">
              <h3>{module.name}</h3>
              <div className="inventory-plan-list">
                {module.plans.map((plan) => (
                  <section key={plan.type} className="service-card inventory-plan-item">
                    <h4>{plan.type}</h4>
                    <p className="inventory-price">{plan.price}</p>
                    <p className="inventory-range">{plan.range}</p>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default InventreesPlanes
