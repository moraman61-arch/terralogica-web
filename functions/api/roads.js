// Overpass bloquea las peticiones de navegador y de redes de nube en varios espejos
// (overpass-api.de responde 521/406). Este proxy consulta el espejo que sí responde
// desde el edge de Cloudflare y devuelve solo el kilometraje ya calculado.
const overpassAttemptPlan = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

const overpassUserAgent = 'TerralogicaINVENTREES/1.0 (+https://www.terralogica.mx)'
const attemptTimeoutMs = 25000
const totalBudgetMs = 95000

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

function jsonResponse(payload, status = 200, corsOrigin = '*') {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
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

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function pointInPolygon(point, polygonRing) {
  let isInside = false
  const [x, y] = point

  for (let i = 0, j = polygonRing.length - 1; i < polygonRing.length; j = i, i += 1) {
    const [xi, yi] = polygonRing[i]
    const [xj, yj] = polygonRing[j]

    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi
    if (intersects) {
      isInside = !isInside
    }
  }

  return isInside
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

function polygonCoverageRatio(polygonCoordinates) {
  const meanLatitude = polygonCoordinates.reduce((sum, [lat]) => sum + lat, 0) / polygonCoordinates.length
  const longitudeScale = Math.cos((meanLatitude * Math.PI) / 180) || 1
  let doubledArea = 0

  for (let index = 0; index < polygonCoordinates.length; index += 1) {
    const [lat1, lon1] = polygonCoordinates[index]
    const [lat2, lon2] = polygonCoordinates[(index + 1) % polygonCoordinates.length]
    doubledArea += lon1 * longitudeScale * lat2 - lon2 * longitudeScale * lat1
  }

  const lats = polygonCoordinates.map(([lat]) => lat)
  const lons = polygonCoordinates.map(([, lon]) => lon)
  const boundingArea =
    (Math.max(...lats) - Math.min(...lats)) * (Math.max(...lons) - Math.min(...lons)) * longitudeScale

  if (!(boundingArea > 0)) {
    return 0
  }

  return Math.abs(doubledArea) / 2 / boundingArea
}

function buildRoadLengthQuery(polygonCoordinates, timeoutSeconds = 35) {
  const lats = polygonCoordinates.map(([lat]) => lat)
  const lons = polygonCoordinates.map(([, lon]) => lon)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)

  // El filtro por caja delimitadora usa el indice espacial de Overpass y responde mucho mas
  // rapido que (poly:"..."); el recorte exacto al poligono se hace despues al medir segmentos.
  const areaFilter =
    polygonCoverageRatio(polygonCoordinates) >= 0.4
      ? `${minLat},${minLon},${maxLat},${maxLon}`
      : `poly:"${(() => {
          const closedPolygon =
            polygonCoordinates[0][0] !== polygonCoordinates[polygonCoordinates.length - 1][0] ||
            polygonCoordinates[0][1] !== polygonCoordinates[polygonCoordinates.length - 1][1]
              ? [...polygonCoordinates, polygonCoordinates[0]]
              : polygonCoordinates

          return closedPolygon.map(([lat, lon]) => `${lat} ${lon}`).join(' ')
        })()}"`

  return `[out:json][timeout:${timeoutSeconds}];
(
  way["highway"]["highway"!~"footway|path|cycleway|bridleway|steps|pedestrian|corridor"](${areaFilter});
);
out geom qt;`
}

function normalizePolygon(value) {
  if (!Array.isArray(value) || value.length < 3) {
    return null
  }

  const points = []

  for (const point of value) {
    if (!Array.isArray(point) || point.length < 2) {
      return null
    }

    const lat = Number(point[0])
    const lon = Number(point[1])

    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return null
    }

    points.push([lat, lon])
  }

  return points
}

export function computeRoadLengthKm(elements, polygonRingLonLat) {
  const wayElements = Array.isArray(elements) ? elements.filter((element) => element?.type === 'way') : []
  let totalLengthKm = 0

  for (const wayElement of wayElements) {
    const geometry = Array.isArray(wayElement.geometry) ? wayElement.geometry : []
    if (geometry.length < 2) {
      continue
    }

    for (let pointIndex = 0; pointIndex < geometry.length - 1; pointIndex += 1) {
      const start = geometry[pointIndex]
      const end = geometry[pointIndex + 1]

      if (!Number.isFinite(start?.lon) || !Number.isFinite(start?.lat) || !Number.isFinite(end?.lon) || !Number.isFinite(end?.lat)) {
        continue
      }

      const startPoint = [start.lon, start.lat]
      const endPoint = [end.lon, end.lat]
      const segmentLengthKm = haversineDistanceKm(startPoint, endPoint)

      if (segmentLengthKm === 0) {
        continue
      }

      totalLengthKm += segmentLengthKm * estimateSegmentInsideRatio(startPoint, endPoint, polygonRingLonLat)
    }
  }

  return Number(totalLengthKm.toFixed(2))
}

export async function onRequestOptions(context) {
  const allowedOrigin = context.env.ALLOWED_ORIGIN || '*'
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function onRequestPost(context) {
  const { request, env } = context
  const allowedOrigin = env.ALLOWED_ORIGIN || '*'

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'El cuerpo de la solicitud no es valido.' }, 400, allowedOrigin)
  }

  const polygon = normalizePolygon(payload?.polygon)
  if (!polygon) {
    return jsonResponse({ error: 'El poligono enviado no es valido.' }, 400, allowedOrigin)
  }

  const query = buildRoadLengthQuery(polygon)
  const polygonRingLonLat = polygon.map(([lat, lon]) => [lon, lat])
  const startedAt = Date.now()
  const failures = []

  for (const endpoint of overpassAttemptPlan) {
    if (Date.now() - startedAt > totalBudgetMs) {
      failures.push('tiempo total agotado')
      break
    }

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
            Accept: 'application/json',
            'User-Agent': overpassUserAgent,
          },
          body: query,
        },
        attemptTimeoutMs,
      )

      if (!response.ok) {
        failures.push(`HTTP ${response.status}`)
        continue
      }

      const data = await response.json()
      const roadLengthKm = computeRoadLengthKm(data?.elements, polygonRingLonLat)

      return jsonResponse({ roadLengthKm, endpoint, elapsedMs: Date.now() - startedAt }, 200, allowedOrigin)
    } catch (error) {
      failures.push(error?.name === 'AbortError' ? 'sin respuesta' : 'error de red')
    }
  }

  return jsonResponse(
    {
      error: 'El servicio de vialidades no respondio.',
      detail: [...new Set(failures)].join(', '),
    },
    502,
    allowedOrigin,
  )
}
