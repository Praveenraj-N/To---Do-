export function formatDateTime(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString()
}

export function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString()
}
