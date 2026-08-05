function buildCorsHeaders(origin) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
  }
}

function jsonResponse(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: buildCorsHeaders(origin),
  })
}

export async function onRequestOptions(context) {
  const allowedOrigin = context.env.ALLOWED_ORIGIN || '*'
  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(allowedOrigin),
  })
}

export async function onRequestGet(context) {
  const { env } = context
  const allowedOrigin = env.ALLOWED_ORIGIN || '*'

  const dependencies = {
    hasR2Binding: Boolean(env.QUOTE_FILES),
    hasD1Binding: Boolean(env.QUOTES_DB),
    hasResendKey: Boolean(env.RESEND_API_KEY),
    hasNotifyTo: Boolean(env.NOTIFY_TO),
    hasNotifyFrom: Boolean(env.NOTIFY_FROM),
  }

  const hasCriticalDependencies = dependencies.hasR2Binding && dependencies.hasD1Binding
  const healthStatus = hasCriticalDependencies ? 'ok' : 'degraded'

  return jsonResponse(
    {
      ok: hasCriticalDependencies,
      status: healthStatus,
      service: 'terralogics-quote-api',
      timestamp: new Date().toISOString(),
      dependencies,
    },
    hasCriticalDependencies ? 200 : 503,
    allowedOrigin,
  )
}
