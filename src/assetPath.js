const assetBase = import.meta.env.BASE_URL || '/'

export function assetPath(path) {
  const normalizedBase = assetBase.endsWith('/') ? assetBase : `${assetBase}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}${normalizedPath}`
}