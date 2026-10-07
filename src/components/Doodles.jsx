// Hand-drawn style line illustrations; colors come from the .d-* classes in index.css

function Leaf({ x, y, angle, scale = 1, color = 'green' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path className={`d-fill-${color}`} d="M0 0 C8 -14 30 -16 42 0 C30 14 8 12 0 0Z" />
      <path className={`d-line-${color}`} d="M4 0 Q22 -2 38 0" />
    </g>
  )
}

export function Basil({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 140 170" aria-hidden="true">
      <path className="d-line-green" d="M70 165 C68 130 72 95 70 40" />
      <Leaf x={70} y={40} angle={-90} scale={0.8} />
      <Leaf x={70} y={70} angle={-150} scale={0.9} />
      <Leaf x={70} y={70} angle={-30} scale={0.9} />
      <Leaf x={70} y={105} angle={-160} scale={1.1} />
      <Leaf x={70} y={105} angle={-20} scale={1.1} />
      <Leaf x={69} y={138} angle={-170} scale={1.2} />
      <Leaf x={69} y={138} angle={-10} scale={1.2} />
    </svg>
  )
}

export function Rosemary({ className = '' }) {
  const needles = []
  for (let y = 22; y <= 158; y += 12) {
    needles.push(<path key={`l${y}`} className="d-needle" d={`M30 ${y} L15 ${y - 9}`} />)
    needles.push(<path key={`r${y}`} className="d-needle" d={`M30 ${y + 6} L45 ${y - 3}`} />)
  }
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 60 180" aria-hidden="true">
      <path className="d-line-green" d="M30 175 C28 130 32 80 30 10" />
      {needles}
    </svg>
  )
}

export function Lemon({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 150 110" aria-hidden="true">
      <path
        className="d-fill-lemon"
        d="M28 62 C26 38 50 22 76 24 C102 26 120 42 120 62 C120 82 100 96 74 96 C48 96 30 84 28 62Z"
      />
      <path className="d-line-lemon" d="M28 62 L18 60 M120 62 L130 64" />
      <path className="d-line-lemon" d="M48 50 Q54 42 64 40" />
      <Leaf x={80} y={25} angle={-35} scale={0.85} />
    </svg>
  )
}

export function LemonSlice({ className = '' }) {
  const segments = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4
    return `M40 40 L${40 + 26 * Math.cos(angle)} ${40 + 26 * Math.sin(angle)}`
  })
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 80 80" aria-hidden="true">
      <circle className="d-fill-lemon" cx="40" cy="40" r="34" />
      <circle className="d-line-lemon" cx="40" cy="40" r="27" />
      <path className="d-line-lemon" d={segments.join(' ')} />
    </svg>
  )
}

export function Tomatoes({ className = '' }) {
  const calyx = (x, y) =>
    `M${x} ${y} l-10 -5 M${x} ${y} l10 -5 M${x} ${y} l-6 6 M${x} ${y} l6 6 M${x} ${y} v-11`
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 140 110" aria-hidden="true">
      <circle className="d-fill-accent" cx="50" cy="64" r="32" />
      <circle className="d-fill-accent" cx="98" cy="74" r="24" />
      <path className="d-line-accent" d="M34 54 Q38 44 48 42" />
      <path className="d-line-green" d={`${calyx(50, 34)} ${calyx(98, 52)}`} />
    </svg>
  )
}

export function SteamingPot({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 160 140" aria-hidden="true">
      <path className="d-line-accent d-steam" d="M62 34 c-8 -8 8 -14 0 -24" />
      <path className="d-line-accent d-steam" d="M80 30 c-8 -8 8 -14 0 -24" />
      <path className="d-line-accent d-steam" d="M98 34 c-8 -8 8 -14 0 -24" />
      <path className="d-fill-accent" d="M28 66 h104 v40 a20 20 0 0 1 -20 20 h-64 a20 20 0 0 1 -20 -20z" />
      <path className="d-line-accent" d="M28 78 h-12 a6 6 0 0 0 0 12 h12 M132 78 h12 a6 6 0 0 1 0 12 h-12" />
      <path className="d-fill-paper" d="M22 66 h116 M34 66 C34 46 126 46 126 66" />
      <circle className="d-fill-paper" cx="80" cy="46" r="5" />
    </svg>
  )
}

export function WoodenSpoon({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 50 190" aria-hidden="true">
      <ellipse className="d-fill-wood" cx="25" cy="34" rx="17" ry="27" />
      <ellipse className="d-line-wood" cx="25" cy="34" rx="10" ry="18" />
      <path className="d-fill-wood" d="M21 61 L21 180 a4 4 0 0 0 8 0 L29 61" />
    </svg>
  )
}

export function RecipeNotebook({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-fill-paper" d="M22 10 h54 a4 4 0 0 1 4 4 v72 a4 4 0 0 1 -4 4 h-54z" />
      <path className="d-line-accent" d="M14 24 h14 M14 40 h14 M14 56 h14 M14 72 h14" />
      <path
        className="d-fill-accent"
        d="M51 34 c-6 -8 -18 -3 -13 7 l13 11 l13 -11 c5 -10 -7 -15 -13 -7z"
      />
      <path className="d-line-accent" d="M36 66 h30 M36 76 h20" />
      <Leaf x={70} y={22} angle={-130} scale={0.4} />
    </svg>
  )
}

export function Camera({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 80" aria-hidden="true">
      <path
        className="d-fill-paper"
        d="M12 26 a6 6 0 0 1 6 -6 h14 l6 -9 h24 l6 9 h14 a6 6 0 0 1 6 6 v40 a6 6 0 0 1 -6 6 h-64 a6 6 0 0 1 -6 -6z"
      />
      <circle className="d-fill-accent" cx="50" cy="45" r="16" />
      <circle className="d-line-accent" cx="50" cy="45" r="8" />
      <circle className="d-fill-lemon" cx="76" cy="31" r="3" />
      <Leaf x={14} y={70} angle={-60} scale={0.45} />
    </svg>
  )
}

/* Category drawings */

function Cup({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-line-accent d-steam" d="M36 30 c-5 -5 5 -9 0 -16" />
      <path className="d-line-accent d-steam" d="M50 30 c-5 -5 5 -9 0 -16" />
      <path className="d-line-accent" d="M68 46 h6 a9 9 0 0 1 0 18 h-7" />
      <path className="d-fill-accent" d="M22 40 h46 v20 a20 20 0 0 1 -20 20 h-6 a20 20 0 0 1 -20 -20z" />
      <path className="d-line-accent" d="M14 86 h66" />
    </svg>
  )
}

function SaladBowl({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <Leaf x={34} y={54} angle={-125} scale={0.7} />
      <Leaf x={50} y={54} angle={-90} scale={0.75} />
      <Leaf x={66} y={54} angle={-55} scale={0.7} />
      <circle className="d-fill-accent" cx="42" cy="46" r="7" />
      <path className="d-fill-wood" d="M12 52 h76 a38 30 0 0 1 -76 0z" />
      <path className="d-line-wood" d="M40 86 h20" />
    </svg>
  )
}

function PastaPlate({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <ellipse className="d-fill-paper" cx="50" cy="64" rx="42" ry="17" />
      <ellipse className="d-line-accent" cx="50" cy="64" rx="28" ry="10" />
      <path
        className="d-line-lemon"
        d="M30 62 c5 -12 10 8 15 -2 s10 8 15 -2 s10 8 12 -2 M34 56 c4 -10 9 6 13 -2 s9 6 13 -2 s8 6 8 -2"
      />
      <circle className="d-fill-accent" cx="50" cy="52" r="5" />
      <Leaf x={54} y={50} angle={-40} scale={0.4} />
    </svg>
  )
}

function Carrot({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-line-green" d="M66 32 l0 -20 M66 32 l12 -14 M66 32 l18 -4" />
      <path
        className="d-fill-accent"
        d="M20 84 C36 64 50 46 58 34 C64 26 76 34 70 42 C58 54 40 70 20 84Z"
      />
      <path className="d-line-accent" d="M42 62 l6 5 M53 50 l5 5" />
    </svg>
  )
}

function CakeSlice({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-line-green" d="M80 28 q2 -8 9 -10" />
      <path className="d-fill-wood" d="M14 78 L86 78 L86 42 Z" />
      <path className="d-line-accent" d="M52 60 L86 60" />
      <path className="d-line-accent" d="M12 79 L88 41" />
      <circle className="d-fill-accent" cx="80" cy="34" r="6" />
    </svg>
  )
}

function Glass({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-line-accent" d="M56 46 L66 10 h10" />
      <path className="d-fill-lemon" d="M34 42 h32 l-4 38 h-24z" />
      <path className="d-line-accent" d="M28 22 h44 l-7 64 h-30z" />
      <circle className="d-fill-lemon" cx="30" cy="24" r="10" />
      <path className="d-line-lemon" d="M30 24 l-6 -6 M30 24 l8 -3 M30 24 l-1 9" />
    </svg>
  )
}

function ForkAndKnife({ className = '' }) {
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path className="d-line-accent" d="M38 14 v72 M30 14 v18 a8 8 0 0 0 16 0 v-18" />
      <path className="d-fill-paper" d="M64 86 V14 c12 8 14 26 0 38" />
    </svg>
  )
}

const CATEGORY_DRAWINGS = {
  breakfast: Cup,
  starters: SaladBowl,
  'main courses': PastaPlate,
  'side dishes': Carrot,
  desserts: CakeSlice,
  drinks: Glass,
}

// Drawing for a category by name; unknown categories get a fork and knife
export function CategoryDrawing({ name, className = '' }) {
  const Drawing = CATEGORY_DRAWINGS[name.toLowerCase()] ?? ForkAndKnife
  return <Drawing className={className} />
}

const PLACEHOLDERS = [SteamingPot, Lemon, Tomatoes, Basil]

// A drawing for recipes without a photo, stable for each recipe
export function RecipePlaceholder({ id, className = '' }) {
  const Drawing = PLACEHOLDERS[id % PLACEHOLDERS.length]
  return <Drawing className={className} />
}
