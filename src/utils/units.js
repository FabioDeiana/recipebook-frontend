// Grouped for the unit <select>; labels are what the user sees
export const UNIT_GROUPS = [
  {
    label: 'Metric',
    units: [
      { value: 'G', label: 'g' },
      { value: 'KG', label: 'kg' },
      { value: 'ML', label: 'ml' },
      { value: 'CL', label: 'cl' },
      { value: 'DL', label: 'dl' },
      { value: 'L', label: 'l' },
    ],
  },
  {
    label: 'US',
    units: [
      { value: 'OZ', label: 'oz' },
      { value: 'LB', label: 'lb' },
      { value: 'FL_OZ', label: 'fl oz' },
      { value: 'CUP', label: 'cup' },
      { value: 'PINT', label: 'pint' },
      { value: 'QUART', label: 'quart' },
    ],
  },
  {
    label: 'Common',
    units: [
      { value: 'TSP', label: 'tsp' },
      { value: 'TBSP', label: 'tbsp' },
      { value: 'PIECE', label: 'piece' },
      { value: 'PINCH', label: 'pinch' },
      { value: 'TO_TASTE', label: 'to taste' },
    ],
  },
]

const LABELS = Object.fromEntries(
  UNIT_GROUPS.flatMap((group) => group.units.map((unit) => [unit.value, unit.label])),
)

const PLURALS = {
  CUP: 'cups',
  PINT: 'pints',
  QUART: 'quarts',
  PINCH: 'pinches',
}

export function unitLabel(unit, quantity) {
  if (quantity != null && quantity > 1 && PLURALS[unit]) return PLURALS[unit]
  return LABELS[unit] ?? unit
}
