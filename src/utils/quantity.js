// Quantities are numbers in the API; in the UI they can be fractions ("1/3", "1 1/2", "½")

const METRIC_UNITS = ['G', 'KG', 'ML', 'CL', 'DL', 'L']

const UNICODE_FRACTIONS = {
  '½': '1/2',
  '⅓': '1/3',
  '⅔': '2/3',
  '¼': '1/4',
  '¾': '3/4',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
}

// Fractions used when displaying, with their glyph and their typed form
const COMMON_FRACTIONS = [
  { value: 1 / 8, glyph: '⅛', text: '1/8' },
  { value: 1 / 4, glyph: '¼', text: '1/4' },
  { value: 1 / 3, glyph: '⅓', text: '1/3' },
  { value: 3 / 8, glyph: '⅜', text: '3/8' },
  { value: 1 / 2, glyph: '½', text: '1/2' },
  { value: 5 / 8, glyph: '⅝', text: '5/8' },
  { value: 2 / 3, glyph: '⅔', text: '2/3' },
  { value: 3 / 4, glyph: '¾', text: '3/4' },
  { value: 7 / 8, glyph: '⅞', text: '7/8' },
]

const TOLERANCE = 0.02

/**
 * Parses what the user typed. Returns null for an empty value and NaN when it can't be read.
 * Accepts "2", "0.5", "0,5", "1/3", "1 1/2", "½", "1½".
 */
export function parseQuantity(input) {
  let text = String(input ?? '').trim()
  if (text === '') return null

  for (const [glyph, fraction] of Object.entries(UNICODE_FRACTIONS)) {
    text = text.replace(glyph, ` ${fraction}`)
  }
  text = text.replace(',', '.').trim()

  let match = text.match(/^\d+(\.\d+)?$|^\.\d+$/)
  if (match) return Number(text)

  match = text.match(/^(\d+)\/(\d+)$/)
  if (match) return Number(match[2]) === 0 ? NaN : Number(match[1]) / Number(match[2])

  match = text.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (match) {
    return Number(match[3]) === 0 ? NaN : Number(match[1]) + Number(match[2]) / Number(match[3])
  }

  return NaN
}

function decimal(quantity) {
  const decimals = quantity >= 100 ? 0 : quantity >= 10 ? 1 : 2
  return String(Number(quantity.toFixed(decimals)))
}

// Splits a number into whole part and a common fraction, if it is close to one
function toFraction(quantity) {
  let whole = Math.floor(quantity)
  const rest = quantity - whole
  if (rest < TOLERANCE) return { whole, fraction: null }
  if (1 - rest < TOLERANCE) return { whole: whole + 1, fraction: null }
  const fraction = COMMON_FRACTIONS.find((f) => Math.abs(f.value - rest) < TOLERANCE)
  return fraction ? { whole, fraction } : null
}

// For display: "⅓", "1 ½", "250"; metric units always use decimals
export function formatQuantity(quantity, unit) {
  if (quantity == null) return ''
  if (METRIC_UNITS.includes(unit)) return decimal(quantity)
  const parts = toFraction(quantity)
  if (!parts) return decimal(quantity)
  if (!parts.fraction) return String(parts.whole)
  return parts.whole ? `${parts.whole} ${parts.fraction.glyph}` : parts.fraction.glyph
}

// For the form input: "1/3", "1 1/2", "250"
export function quantityToInput(quantity, unit) {
  if (quantity == null) return ''
  const parts = METRIC_UNITS.includes(unit) ? null : toFraction(quantity)
  if (!parts) return String(Number(quantity.toFixed(4)))
  if (!parts.fraction) return String(parts.whole)
  return parts.whole ? `${parts.whole} ${parts.fraction.text}` : parts.fraction.text
}
