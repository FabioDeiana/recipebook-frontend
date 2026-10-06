function Pagination({ page, onChange }) {
  if (page.totalPages <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button secondary"
        disabled={page.number === 0}
        onClick={() => onChange(page.number - 1)}
      >
        ← Previous
      </button>
      <span>
        Page {page.number + 1} of {page.totalPages}
      </span>
      <button
        type="button"
        className="button secondary"
        disabled={page.number >= page.totalPages - 1}
        onClick={() => onChange(page.number + 1)}
      >
        Next →
      </button>
    </nav>
  )
}

export default Pagination
