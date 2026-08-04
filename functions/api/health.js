export async function onRequestGet(context) {
  const allowedOrigin = context.env.ALLOWED_ORIGIN || '*'

  return new Response(
    JSON.stringify({
      ok: true,
      service: 'terralogics-quote-api',
      timestamp: new Date().toISOString(),
      hasR2Binding: Boolean(context.env.QUOTE_FILES),
      hasD1Binding: Boolean(context.env.QUOTES_DB),
      hasResendKey: Boolean(context.env.RESEND_API_KEY),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
    },
  )
}
