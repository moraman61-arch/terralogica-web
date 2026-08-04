# Go-Live Checklist: GitHub Pages -> Cloudflare Pages

Objetivo: migrar sin romper el sitio y mantener rollback rapido.

## Fase 0: Preparacion

1. Confirmar que el repositorio principal sigue en GitHub (`main`).
2. Confirmar build command en Cloudflare Pages: `npm run build`.
3. Confirmar output directory en Cloudflare Pages: `dist`.
4. Confirmar Node version en Pages (recomendado: 22).

## Fase 1: Provision en Cloudflare (paralelo, sin cortar trafico)

1. Crear proyecto Pages conectado al repo `moraman61-arch/terralogica-web`.
2. Crear bucket R2: `terralogics-quote-files`.
3. Crear base D1: `terralogics_quotes`.
4. Ejecutar esquema SQL:

```bash
wrangler d1 execute terralogics_quotes --file=cloudflare/d1-schema.sql
```

5. Agregar bindings en Pages:
- `QUOTE_FILES` -> bucket R2
- `QUOTES_DB` -> base D1

6. Agregar variables de entorno en Pages (Production y Preview):
- `ALLOWED_ORIGIN=https://www.terralogica.mx`
- `NOTIFY_TO=info@terralogica.mx`
- `NOTIFY_FROM=Cotizador INVENTREES <onboarding@resend.dev>`

7. Agregar secret en Pages:
- `RESEND_API_KEY=<tu_api_key_real>`

## Fase 2: Validacion tecnica (en URL pages.dev)

1. Verificar salud de Functions:
- `GET /api/health`
- Esperado: `ok: true`, `hasR2Binding: true`, `hasD1Binding: true`

2. Verificar endpoint de cotizacion:
- Enviar solicitud real desde formulario en `InventreesProyectos`.
- Esperado: mensaje de exito en UI.

3. Verificar persistencia:
- D1: fila nueva en `project_quotes`.
- R2: archivo nuevo en ruta `quotes/YYYY-MM-DD/...`.

4. Verificar notificacion por correo:
- Revisar inbox de `info@terralogica.mx`.

## Fase 3: UAT funcional (sin DNS cutover)

1. Navegacion completa del sitio (Inicio, Servicios, Proyectos, Inventrees).
2. Flujo de poligono:
- Dibujar poligono -> aceptar -> regresar a Cotizacion.
- Confirmar estado: `Poligono registrado`.

3. Envio de formulario:
- Opciones seleccionadas + datos cliente + poligono.
- Confirmar exito y trazabilidad en D1/R2/correo.

## Fase 4: Cutover de dominio

1. Configurar dominio custom en Cloudflare Pages (`www.terralogica.mx`).
2. Actualizar DNS para apuntar a Pages segun instrucciones del dashboard.
3. Mantener GitHub Pages activo 48-72h como respaldo.

## Fase 5: Post-cutover

1. Smoke test en dominio final.
2. Revisar errores Functions en logs de Cloudflare.
3. Revisar metricas R2/D1 y bandeja de notificaciones.

## Rollback rapido

Si detectas fallo critico:
1. Revertir DNS al endpoint anterior (GitHub Pages).
2. Mantener Pages activo para debugging.
3. Corregir en `main`, volver a desplegar y reintentar cutover.

## Criterio de salida (Go)

- `/api/health` OK
- Cotizacion guarda en D1
- Poligono guarda en R2
- Correo llega a `info@terralogica.mx`
- Sin errores funcionales criticos en UAT
