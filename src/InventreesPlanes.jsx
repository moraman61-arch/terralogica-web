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
        price: 'USD 0.60 por km de vialidad (mínimo USD 100.00)',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.6,
        minAmount: 100,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 450.00 a USD 500.00 mensuales (descuento por meses)',
        range: 'Más de 500 km y hasta 10,000 km',
        mode: 'scaled-monthly',
        minAmount: 450,
        maxAmount: 500,
        startKm: 500,
        endKm: 10000,
        discountPerExtraMonth: 0.01,
        minKm: 500,
        minKmExclusive: true,
        maxKm: 10000,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.20 por km de vialidad (tope USD 15,000.00)',
        range: 'Más de 10,000 km',
        mode: 'rate',
        rate: 1.2,
        maxAmount: 15000,
        minKm: 10000,
        minKmExclusive: true,
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
        price: 'USD 0.85 por km de vialidad (mínimo USD 150.00)',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.85,
        minAmount: 150,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 500.00 a USD 550.00 mensuales (descuento por meses)',
        range: 'Más de 500 km y hasta 10,000 km',
        mode: 'scaled-monthly',
        minAmount: 500,
        maxAmount: 550,
        startKm: 500,
        endKm: 10000,
        discountPerExtraMonth: 0.01,
        minKm: 500,
        minKmExclusive: true,
        maxKm: 10000,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.70 por km de vialidad (tope USD 18,000.00)',
        range: 'Más de 10,000 km',
        mode: 'rate',
        rate: 1.7,
        maxAmount: 18000,
        minKm: 10000,
        minKmExclusive: true,
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
        price: 'USD 0.85 por km de vialidad (mínimo USD 150.00)',
        range: 'Hasta 500 km',
        mode: 'rate',
        billing: 'monthly',
        rate: 0.85,
        minAmount: 150,
        minKm: 0,
        maxKm: 500,
      },
      {
        licenseId: 'monthly-medium-large',
        type: 'Suscripción mensual para ciudades medias y grandes',
        price: 'USD 500.00 a USD 550.00 mensuales (descuento por meses)',
        range: 'Más de 500 km y hasta 10,000 km',
        mode: 'scaled-monthly',
        minAmount: 500,
        maxAmount: 550,
        startKm: 500,
        endKm: 10000,
        discountPerExtraMonth: 0.01,
        minKm: 500,
        minKmExclusive: true,
        maxKm: 10000,
      },
      {
        licenseId: 'permanent-medium-large',
        type: 'Licencia permanente para ciudades medias y grandes',
        price: 'USD 1.70 por km de vialidad (tope USD 18,000.00)',
        range: 'Más de 10,000 km',
        mode: 'rate',
        rate: 1.7,
        maxAmount: 18000,
        minKm: 10000,
        minKmExclusive: true,
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

const contactEmail = 'moraman61@gmail.com'

const introVideos = [
  {
    label: 'Geolocalizador',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/7a612d900ce0f73a0090525603f4235c/manifest/video.m3u8',
  },
  {
    label: 'Medidor',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/5e33222f0d842e505fbbde0cd1c5a43e/manifest/video.m3u8',
  },
  {
    label: 'Caracterizador',
    src: 'https://customer-kywq3a5r9m82v8jr.cloudflarestream.com/1c000c5fad5fd0d9a7dcb04adcce4907/manifest/video.m3u8',
  },
]

const moduleFeaturePanels = [
  {
    title: 'Geolocalizador',
    features: [
      'Geolocalización de árboles vivos',
      'Geolocalización de cepas vacantes',
      'Geolocalización de tocones',
      'Geolocalización de árboles muertos',
      'Precisión 30 cm @ 5 m, 70 cm @ 10 m',
      'Definición de cercas limitantes',
      'Trazo de guías auxiliares',
      'Corrección por elevación',
    ],
  },
  {
    title: 'Medidor',
    features: [
      'Incluye Geolocalizador',
      'Medición de inclinación',
      'Medición de DAP (1.30 m)',
      'Precisión 2 cm @ 5 m',
      'Medición de copa',
      'Estimación de desbalance de copa',
      'Medición de altura',
    ],
  },
  {
    title: 'Caracterizador',
    features: [
      'Incluye Geolocalizador',
      'Identificación de especie con IA',
      'Especies frecuentes',
      'Estructura del árbol',
      'Indicación de mantenimiento',
      'Indicación de desmoche',
      'Indicación de interferencia con infraestructura aérea y terrestre',
    ],
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

  if (km > 10000) {
    return 'permanent-medium-large'
  }

  return 'monthly-medium-large'
}

function calculateQuote(plan, km, months = 1) {
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

  if (plan.minKm !== undefined && (plan.minKmExclusive ? km <= plan.minKm : km < plan.minKm)) {
    return {
      status: 'invalid',
      message: plan.minKmExclusive
        ? `Esta modalidad aplica para valores mayores a ${formatKmLimit(plan.minKm)} km de vialidad.`
        : `Esta modalidad aplica a partir de ${formatKmLimit(plan.minKm)} km de vialidad.`,
    }
  }

  const normalizedMonths = Number.isFinite(Number(months)) && Number(months) >= 1 ? Math.floor(Number(months)) : 1

  if (plan.mode === 'scaled-monthly') {
    const kmBase = Math.min(Math.max(km, plan.startKm), plan.endKm)
    const kmSpan = Math.max(plan.endKm - plan.startKm, 1)
    const growthRatio = (kmBase - plan.startKm) / kmSpan
    const baseAmount = plan.minAmount + (plan.maxAmount - plan.minAmount) * growthRatio
    const discountRate = normalizedMonths >= 2 ? (normalizedMonths - 1) * (plan.discountPerExtraMonth ?? 0) : 0
    const discountedAmount = Math.max(baseAmount * (1 - discountRate), 0)
    const discountPercent = Math.max(discountRate * 100, 0)

    return {
      status: 'valid',
      amountLabel: `${currencyFormatter.format(discountedAmount)} / mes`,
      detail:
        normalizedMonths >= 2
          ? `Escala mensual entre ${currencyFormatter.format(plan.minAmount)} y ${currencyFormatter.format(plan.maxAmount)} según km. Incluye descuento de ${discountPercent.toFixed(0)}% por contratar ${normalizedMonths} meses desde el inicio.`
          : `Escala mensual entre ${currencyFormatter.format(plan.minAmount)} y ${currencyFormatter.format(plan.maxAmount)} según km.`,
    }
  }

  if (plan.mode === 'flat-monthly') {
    return {
      status: 'valid',
      amountLabel: `${currencyFormatter.format(plan.flatAmount)} / mes`,
      detail: 'Pago mensual estimado para la modalidad seleccionada.',
    }
  }

  const rawTotal = km * plan.rate
  const withMin = plan.minAmount !== undefined ? Math.max(rawTotal, plan.minAmount) : rawTotal
  const total = plan.maxAmount !== undefined ? Math.min(withMin, plan.maxAmount) : withMin

  return {
    status: 'valid',
    amountLabel: plan.billing === 'monthly' ? `${currencyFormatter.format(total)} / mes` : currencyFormatter.format(total),
    detail:
      plan.billing === 'monthly'
        ? `Pago mensual estimado con ${formatKmLimit(km)} km de vialidad a ${currencyFormatter.format(plan.rate)} por km.`
        : `Estimado con ${formatKmLimit(km)} km de vialidad a ${currencyFormatter.format(plan.rate)} por km.`,
  }
}

function buildQuoteEmailDraft({ moduleName, planType, kmValueText, amountLabel, recommendedLabel, monthsText }) {
  const subject = `Solicitud de cotización INVENTREES - ${moduleName}`
  const bodyLines = [
    'Hola,',
    '',
    'Solicito una cotización para INVENTREES con la siguiente configuración:',
    `Módulo: ${moduleName}`,
    `Licencia seleccionada: ${planType}`,
    `Km de vialidad: ${kmValueText}`,
    ...(monthsText ? [`Meses de contratación inicial: ${monthsText}`] : []),
    `Estimado mostrado: ${amountLabel}`,
    `Licencia recomendada por el cotizador: ${recommendedLabel ?? 'No disponible'}`,
    '',
    'Adjuntaremos la capa de polígonos requerida en formato SHP (ZIP), KML o GeoJSON.',
    '',
    'Quedo atento(a) a su propuesta.',
  ]

  const body = bodyLines.join('\n')

  return { subject, body }
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

function getRegisteredPolygonFileName(registration) {
  if (typeof registration?.polygonFileName === 'string' && registration.polygonFileName.trim()) {
    return registration.polygonFileName.trim()
  }

  if (registration?.status === 'registered' && Array.isArray(registration?.polygon) && registration.polygon.length >= 3) {
    return 'inventrees-poligono.kml'
  }

  return null
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
  const [contractMonths, setContractMonths] = useState(1)
  const [kmValue, setKmValue] = useState(initialKmValue ? formatInitialKmValue(initialKmValue) : '')
  const [currentIntroVideoIndex, setCurrentIntroVideoIndex] = useState(0)
  const [isIntroVideoPlaying, setIsIntroVideoPlaying] = useState(true)
  const [polygonStatus, setPolygonStatus] = useState(() => polygonRegistration.status)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [uploadMessage, setUploadMessage] = useState(() => {
    const initialFileName = getRegisteredPolygonFileName(polygonRegistration)
    return initialFileName ? `Archivo registrado disponible: ${initialFileName}.` : 'No hay archivo cargado.'
  })
  const [selectedUploadFileName, setSelectedUploadFileName] = useState('')
  const [quoteAttachmentMessage, setQuoteAttachmentMessage] = useState('')
  const introVideoRef = useRef(null)
  const polygonUploadInputRef = useRef(null)

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
  const quote = calculateQuote(selectedPlan, parsedKm, contractMonths)
  const recommendedLicenseId = getRecommendedLicenseId(parsedKm)
  const recommendedOption = licenseOptions.find((option) => option.id === recommendedLicenseId) ?? null
  const currentRegistration = readPolygonRegistration()
  const hasPolygonForAttachment =
    Boolean(currentRegistration?.polygonAttachment) ||
    (Array.isArray(currentRegistration?.polygon) && currentRegistration.polygon.length >= 3)
  const registeredPolygonFileName = getRegisteredPolygonFileName(currentRegistration)
  const filePickerLabel = selectedUploadFileName || registeredPolygonFileName || 'Ningún archivo seleccionado'
  const quoteEmailDraft =
    quote.status === 'valid'
      ? buildQuoteEmailDraft({
          moduleName: selectedModule.name,
          planType: selectedPlan.type,
          kmValueText: formatKmLimit(parsedKm),
          monthsText: selectedPlan.mode === 'scaled-monthly' ? String(contractMonths) : null,
          amountLabel: quote.amountLabel,
          recommendedLabel: recommendedOption?.label,
        })
      : {
          subject: 'Solicitud de información INVENTREES',
          body: 'Hola,\n\nSolicito información adicional sobre INVENTREES.\n',
        }

  const handleRequestQuote = async () => {
    if (quote.status !== 'valid') {
      return
    }

    const attachmentFile = buildAttachmentFileFromRegistration(currentRegistration)
    let attachmentStatusMessage

    if (attachmentFile && navigator.share && navigator.canShare?.({ files: [attachmentFile] })) {
      try {
        await navigator.share({
          title: `Solicitud de cotización INVENTREES - ${selectedModule.name}`,
          text: 'Se prepara el archivo del polígono para adjuntarlo a la solicitud.',
          files: [attachmentFile],
        })
        attachmentStatusMessage = `Archivo preparado: ${attachmentFile.name}. Verifique que quede adjunto antes de enviar.`
      } catch {
        attachmentStatusMessage =
          `Gmail Web no adjunta archivos desde mailto. Debe adjuntar manualmente: ${attachmentFile.name}.`
      }
    } else if (attachmentFile) {
      downloadFile(attachmentFile)
      attachmentStatusMessage =
        `Se descargó ${attachmentFile.name}. En Gmail Web adjúntelo manualmente antes de enviar la cotización.`
    } else {
      attachmentStatusMessage = 'No se encontró archivo de polígono para adjuntar en esta solicitud.'
    }

    const draftText = [`Para: ${contactEmail}`, `Asunto: ${quoteEmailDraft.subject}`, '', quoteEmailDraft.body].join('\n')

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(draftText)
        setQuoteAttachmentMessage(
          `${attachmentStatusMessage} Se copió la cotización al portapapeles para pegarla en su correo sin abrir una nueva página del navegador.`,
        )
      } catch {
        setQuoteAttachmentMessage(
          `${attachmentStatusMessage} No fue posible copiar automáticamente; use el botón y complete el correo manualmente a ${contactEmail}.`,
        )
      }
      return
    }

    setQuoteAttachmentMessage(
      `${attachmentStatusMessage} Copie manualmente los datos y envíelos a ${contactEmail}.`,
    )
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

  useEffect(() => {
    if (uploadStatus !== 'idle') {
      return
    }

    if (registeredPolygonFileName) {
      setUploadMessage(`Archivo registrado disponible: ${registeredPolygonFileName}.`)
      return
    }

    setUploadMessage('No hay archivo cargado.')
  }, [registeredPolygonFileName, uploadStatus])

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

    setSelectedUploadFileName(selectedFile.name)
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
      setSelectedUploadFileName('')
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
    setSelectedUploadFileName('')
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
          <div className="inventory-feature-panels" aria-label="Características principales por módulo">
            {moduleFeaturePanels.map((panel) => (
              <article key={panel.title} className="inventory-feature-panel">
                <h3>{panel.title}</h3>
                <ul>
                  {panel.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
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
          <h1 className="inventory-hero-title">Crear y mantener su propio inventario de arbolado público urbano es ahora ¡muy fácil!</h1>
          <p className="hero-text inventory-hero-description">
            Estructura comercial flexible y equitativa para comunidades pequeñas, ciudades medias y grandes, con reglas claras por cobertura de km de vialidad. INVENTREES es solo para gobiernos locales y comunidades. No trabajamos con empresas.
          </p>
        </div>
      </section>

      <section className="services-section inventory-requirements-section">
        <div className="section-heading compact">
          <p className="eyebrow">Requisitos del cliente</p>
          <h2>Para cualquier licencia se requiere una capa de polígonos del área de interés. El cliente debe ser un representante del gobierno local o comunidad.</h2>
        </div>
        <div className="identity-card inventory-requirements-card">
          <p>
            El cliente debe proporcionar una capa de polígonos que delimite el área para la cual se solicita la licencia.
          </p>
          <p>
            Formatos aceptados: SHP (archivos comprimidos en ZIP), KML o GeoJSON. También lo puede generar <Link to="/servicios/software/inventrees/poligono">aquí</Link>.
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
              id="inventory-polygon-upload"
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

            {selectedPlan.mode === 'scaled-monthly' ? (
              <label className="inventory-field">
                <span>Meses de contratación inicial</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={contractMonths}
                  onChange={(event) => {
                    const parsedValue = Number(event.target.value)
                    setContractMonths(Number.isFinite(parsedValue) && parsedValue >= 1 ? Math.floor(parsedValue) : 1)
                  }}
                  placeholder="Ej. 2"
                />
              </label>
            ) : null}

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
            <em>Nota:</em> para 500 km o menos, el cotizador recomienda la suscripción mensual para comunidades pequeñas. Para más de 500 km y hasta 10,000 km recomienda la suscripción mensual para ciudades medias y grandes. Para más de 10,000 km recomienda la licencia permanente.
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
            <button
              type="button"
              className={`primary-link inventory-quote-cta${quote.status !== 'valid' ? ' inventory-quote-cta-disabled' : ''}`}
              onClick={handleRequestQuote}
              disabled={quote.status !== 'valid'}
            >
              Solicitar cotización
            </button>
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
