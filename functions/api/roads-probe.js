const probeTargets = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
]

const userAgent = 'TerralogicaINVENTREES/1.0 (+https://www.terralogica.mx)'

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  })
}

async function probe(endpoint) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 55000)
  const startedAt = Date.now()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
      body: '[out:json][timeout:25];way["highway"](poly:"19.3400 -99.1700 19.3400 -99.1690 19.3410 -99.1690 19.3410 -99.1700");out count;',
      signal: controller.signal,
    })

    const text = await response.text()
    return { endpoint, status: response.status, ms: Date.now() - startedAt, head: text.slice(0, 160) }
  } catch (error) {
    return { endpoint, error: error instanceof Error ? error.message : String(error), ms: Date.now() - startedAt }
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function onRequestGet() {
  const results = []
  for (const endpoint of probeTargets) {
    results.push(await probe(endpoint))
  }
  return jsonResponse({ results })
}
