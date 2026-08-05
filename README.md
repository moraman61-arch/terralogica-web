# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Cotizador INVENTREES con Cloudflare

Se implemento un endpoint serverless para recibir cotizaciones con archivo de poligono sin depender del correo del usuario.

- Endpoint: [functions/api/quote.js](functions/api/quote.js)
- Esquema D1: [cloudflare/d1-schema.sql](cloudflare/d1-schema.sql)
- Config base: [wrangler.toml](wrangler.toml)
- Variables locales ejemplo: [.dev.vars.example](.dev.vars.example)

### Flujo

1. El formulario en InventreesProyectos envia `multipart/form-data` con datos del cliente, opciones seleccionadas y archivo de poligono.
2. El endpoint valida y guarda el archivo en R2.
3. El endpoint registra la solicitud en D1.
4. El endpoint intenta enviar notificacion por Resend a `info@terralogica.mx`.

### Setup recomendado en Cloudflare

1. Crear bucket R2 (ejemplo: `terralogics-quote-files`).
2. Crear base D1 (ejemplo: `terralogics_quotes`).
3. Aplicar esquema SQL:

```bash
wrangler d1 execute terralogics_quotes --file=cloudflare/d1-schema.sql
```

4. Configurar variables y secretos (paso clave):

Variables no secretas:

- `ALLOWED_ORIGIN` (ejemplo: `https://www.terralogica.mx`)
- `NOTIFY_TO` (ejemplo: `info@terralogica.mx`)
- `NOTIFY_FROM` (temporal recomendado: `Cotizador INVENTREES <onboarding@resend.dev>`)

Secreto:

- `RESEND_API_KEY`

Con Wrangler:

```bash
wrangler pages secret put RESEND_API_KEY
```

En Cloudflare Dashboard (Pages > tu proyecto > Settings > Environment variables):

- Agregar `ALLOWED_ORIGIN`, `NOTIFY_TO`, `NOTIFY_FROM` como variables.
- Agregar `RESEND_API_KEY` como secret.

5. Enlazar bindings en el proyecto Pages:

- R2 binding: `QUOTE_FILES`
- D1 binding: `QUOTES_DB`

6. Deploy del sitio en Pages.

### Desarrollo local

1. Copiar `.dev.vars.example` a `.dev.vars` y colocar valores reales.
2. Ejecutar entorno local de Pages Functions con Wrangler (si lo usas en local).

### Nota de envio de correo

Cloudflare no envia el correo por si solo. El correo se envia porque el endpoint llama la API de Resend usando `RESEND_API_KEY`.

### Remitente temporal sin verificar dominio

Si aun no verifica dominio en Resend, puede usar temporalmente `onboarding@resend.dev` como remitente.

- Ejemplo: `NOTIFY_FROM=Cotizador INVENTREES <onboarding@resend.dev>`
- `NOTIFY_TO` puede quedarse en `info@terralogica.mx`

## Plantilla Operativa (Deploy + Debug + Go-Live)

Esta plantilla estandariza como pedir despliegues, como reportar errores y como validar salida a produccion para el flujo de cotizacion.

### 1) Prompt maestro de deploy

Usa este prompt tal cual en el chat cuando quieras publicar cambios:

```text
Haz deploy a produccion siguiendo este flujo:
1) Ejecuta build y valida que termine sin errores.
2) Si hay ajustes pendientes, aplicalos y vuelve a validar build.
3) Prepara commit con mensaje claro y descriptivo.
4) Haz push a main.
5) Verifica estado del workflow de deploy y confirma resultado final.

Al final, entregame:
- hash corto del commit
- archivos modificados
- estado del deploy
- riesgos o pendientes (si aplica)
```

### 2) Formato estandar para reportar errores

Cuando algo falle, comparte este bloque completo en una sola pasada:

```text
Contexto:
- Entorno: local | produccion
- Paso que estaba ejecutando:

Request:
- URL:
- Metodo:
- Payload (resumen):

Response:
- HTTP status:
- Body JSON completo:

Esperado vs actual:
- Esperado:
- Actual:

Evidencia adicional:
- Timestamp aproximado:
- Captura/log (si existe):
```

### 3) Checklist pre-produccion (Go-Live)

Ejecuta esta lista antes de publicar:

- [ ] `npm run build` exitoso.
- [ ] `GET /api/health` responde `ok: true` y bindings esperados.
- [ ] `POST /api/quote` exitoso con archivo pequeno de prueba.
- [ ] La respuesta incluye `notificationSent: true` (o razon clara si es `false`).
- [ ] Registro confirmado en D1 (`quotes`) para la solicitud de prueba.
- [ ] Archivo adjunto guardado en R2 y descargable.
- [ ] Flujo Ciudad Grande redirige de Planes a Proyectos con prefill.
- [ ] Validacion de al menos un atributo seleccionado en Proyectos funcionando.
- [ ] Workflow de deploy en GitHub finaliza en estado exitoso.

Tip: si algun punto falla, no despliegues. Primero corrige, revalida el punto y vuelve a correr el checklist completo.
