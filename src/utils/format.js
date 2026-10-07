import { unitLabel } from './units'

// Serving scaling: quantity * newServings / servings; TO_TASTE and null stay unchanged
export function scaleQuantity(quantity, unit, servings, newServings) {
  if (quantity == null || unit === 'TO_TASTE') return quantity
  return (quantity * newServings) / servings
}

export function formatQuantity(quantity) {
  if (quantity == null) return ''
  const decimals = quantity >= 100 ? 0 : quantity >= 10 ? 1 : 2
  return String(Number(quantity.toFixed(decimals)))
}

// Splits an ingredient for display: "400 g" + "chickpeas" + "" + "cooked",
// "2" + "onions", "" + "salt" + ", to taste"
export function ingredientParts({ name, quantity, unit, note }) {
  let amount = ''
  let suffix = ''
  if (unit === 'TO_TASTE') {
    amount = quantity != null ? formatQuantity(quantity) : ''
    suffix = ', to taste'
  } else if (unit === 'PIECE') {
    amount = quantity != null ? formatQuantity(quantity) : ''
  } else if (quantity != null) {
    amount = `${formatQuantity(quantity)} ${unitLabel(unit, quantity)}`
  } else {
    suffix = ` (${unitLabel(unit)})`
  }
  return { amount, name, suffix, note }
}

export function formatMinutes(minutes) {
  if (minutes == null) return null
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

// "YYYY-MM-DD" -> "6 Oct 2026" (parsed as a local date, no timezone shift)
export function formatDate(isoDate) {
  if (!isoDate) return null
  const [year, month, day] = isoDate.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
