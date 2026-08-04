const allowedExtensions = ['.zip', '.kml', '.geojson', '.json']
const maxFileSizeBytes = 9 * 1024 * 1024

async function fetchWithTimeout(url, options, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
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

function sanitizeInput(value, maxLength = 500) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

function isAllowedPolygonFile(fileName) {
  if (typeof fileName !== 'string' || !fileName.trim()) {
    return false
  }

  const lowerName = fileName.toLowerCase()
  return allowedExtensions.some((extension) => lowerName.endsWith(extension))
}

function safeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function parseSelectedServices(rawValue) {
  if (typeof rawValue !== 'string') {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => {
        const title = sanitizeInput(item?.title, 100)
        const selectedOptions = Array.isArray(item?.selectedOptions)
          ? item.selectedOptions.map((option) => sanitizeInput(option, 160)).filter(Boolean)
          : []

        return { title, selectedOptions }
      })
      .filter((item) => item.title)
  } catch {
    return []
  }
}

function buildNotificationText(payload) {
  const serviceLines = payload.selectedServices.length
    ? payload.selectedServices.map((service) => {
        const optionsText = service.selectedOptions.length ? service.selectedOptions.join(', ') : 'Sin seleccion'
        return `- ${service.title}: ${optionsText}`
      })
    : ['- Sin seleccion']

  return [
    'Nueva solicitud de cotizacion INVENTREES',
    '',
    'Datos del cliente:',
    `Nombre: ${payload.nombre}`,
    `Cargo o funcion: ${payload.cargoFuncion}`,
    `Dependencia de gobierno: ${payload.dependenciaGobierno}`,
    `Telefono de contacto: ${payload.telefonoContacto}`,
    `Correo electronico: ${payload.correoElectronico}`,
    '',
    'Atributos solicitados:',
    ...serviceLines,
    '',
    `Total de opciones seleccionadas: ${payload.selectedOptionsCount}`,
    `Archivo del poligono: ${payload.originalFileName}`,
    `Archivo guardado en R2: ${payload.polygonR2Key}`,
    `Solicitud ID: ${payload.id}`,
    `Pagina origen: ${payload.sourcePage}`,
  ].join('\n')
}

async function sendNotificationEmail(payload, env) {
  if (!env.RESEND_API_KEY) {
    return { ok: false, reason: 'missing_resend_key' }
  }

  if (!env.NOTIFY_TO) {
    return { ok: false, reason: 'missing_notify_to' }
  }

  const notifyFrom = env.NOTIFY_FROM || 'Cotizador INVENTREES <onboarding@resend.dev>'

  try {
    const emailBody = buildNotificationText(payload)
    const response = await fetchWithTimeout(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: notifyFrom,
          to: [env.NOTIFY_TO],
          subject: `Nueva solicitud de cotizacion INVENTREES | ${payload.nombre}`,
          text: emailBody,
        }),
      },
      10000,
    )

    if (!response.ok) {
      const detail = await response.text()
      return { ok: false, reason: 'resend_error', detail }
    }

    return { ok: true }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, reason: 'resend_timeout' }
    }

    return { ok: false, reason: 'resend_network_error' }
  }
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
  let currentStep = 'init'

  try {
    if (!env.QUOTE_FILES) {
      return jsonResponse({ error: 'No existe el binding QUOTE_FILES.' }, 500, allowedOrigin)
    }

    if (!env.QUOTES_DB) {
      return jsonResponse({ error: 'No existe el binding QUOTES_DB.' }, 500, allowedOrigin)
    }

    currentStep = 'parse_form_data'
    let formData
    try {
      formData = await request.formData()
    } catch {
      return jsonResponse({ error: 'El cuerpo de la solicitud no es valido.' }, 400, allowedOrigin)
    }

    const nombre = sanitizeInput(formData.get('nombre'), 120)
    const cargoFuncion = sanitizeInput(formData.get('cargoFuncion'), 120)
    const dependenciaGobierno = sanitizeInput(formData.get('dependenciaGobierno'), 160)
    const telefonoContacto = sanitizeInput(formData.get('telefonoContacto'), 60)
    const correoElectronico = sanitizeInput(formData.get('correoElectronico'), 160)
    const sourcePage = sanitizeInput(formData.get('sourcePage'), 260)
    const selectedOptionsCount = Number(formData.get('selectedOptionsCount') || 0)
    const selectedServices = parseSelectedServices(formData.get('selectedServices'))
    const polygonFile = formData.get('polygonFile')

    if (!nombre || !cargoFuncion || !dependenciaGobierno || !telefonoContacto || !correoElectronico) {
      return jsonResponse({ error: 'Faltan datos del cliente requeridos.' }, 400, allowedOrigin)
    }

    if (!/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(correoElectronico)) {
      return jsonResponse({ error: 'El correo electronico no es valido.' }, 400, allowedOrigin)
    }

    if (!(polygonFile instanceof File)) {
      return jsonResponse({ error: 'Debe adjuntar el archivo del poligono.' }, 400, allowedOrigin)
    }

    if (!isAllowedPolygonFile(polygonFile.name)) {
      return jsonResponse({ error: 'Formato de poligono no soportado.' }, 400, allowedOrigin)
    }

    if (polygonFile.size <= 0 || polygonFile.size > maxFileSizeBytes) {
      return jsonResponse({ error: 'El archivo excede el limite permitido (9 MB).' }, 400, allowedOrigin)
    }

    const id = crypto.randomUUID()
    const now = new Date()
    const datePrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
    const safeName = safeFileName(polygonFile.name)
    const polygonR2Key = `quotes/${datePrefix}/${id}/${safeName}`

    currentStep = 'r2_put'
    await env.QUOTE_FILES.put(polygonR2Key, polygonFile.stream(), {
      httpMetadata: {
        contentType: polygonFile.type || 'application/octet-stream',
      },
      customMetadata: {
        quoteId: id,
        nombre,
        correoElectronico,
      },
    })

    const selectedServicesText = JSON.stringify(selectedServices)

    currentStep = 'd1_insert'
    await env.QUOTES_DB.prepare(
      `INSERT INTO project_quotes (
        id,
        created_at,
        nombre,
        cargo_funcion,
        dependencia_gobierno,
        telefono_contacto,
        correo_electronico,
        selected_services,
        selected_options_count,
        polygon_file_name,
        polygon_content_type,
        polygon_file_size,
        polygon_r2_key,
        source_page
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        now.toISOString(),
        nombre,
        cargoFuncion,
        dependenciaGobierno,
        telefonoContacto,
        correoElectronico,
        selectedServicesText,
        Number.isFinite(selectedOptionsCount) ? selectedOptionsCount : 0,
        polygonFile.name,
        polygonFile.type || null,
        polygonFile.size,
        polygonR2Key,
        sourcePage || null,
      )
      .run()

    const notificationPayload = {
      id,
      nombre,
      cargoFuncion,
      dependenciaGobierno,
      telefonoContacto,
      correoElectronico,
      selectedServices,
      selectedOptionsCount: Number.isFinite(selectedOptionsCount) ? selectedOptionsCount : 0,
      originalFileName: polygonFile.name,
      polygonR2Key,
      sourcePage: sourcePage || 'N/D',
    }

    currentStep = 'resend_notify'
    const emailResult = await sendNotificationEmail(notificationPayload, env)

    return jsonResponse(
      {
        ok: true,
        id,
        notificationSent: Boolean(emailResult.ok),
        notificationReason: emailResult.ok ? null : emailResult.reason,
      },
      200,
      allowedOrigin,
    )
  } catch (error) {
    const safeMessage = error instanceof Error ? error.message.slice(0, 220) : 'Error no identificado'

    console.error('quote_api_error', {
      step: currentStep,
      message: safeMessage,
    })

    return jsonResponse(
      {
        error: `Fallo interno en etapa: ${currentStep}`,
        detail: safeMessage,
      },
      500,
      allowedOrigin,
    )
  }
}
