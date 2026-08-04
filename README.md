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
- `NOTIFY_FROM` (ejemplo: `Cotizador INVENTREES <noreply@terralogica.mx>`)

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
