/** Restituisce la data di oggi in formato yyyy-MM-dd nel fuso orario locale */
export function getLocalToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
