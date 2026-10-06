function ErrorMessage({ error }) {
  if (!error) return null
  const message = typeof error === 'string' ? error : error.message
  return (
    <p className="error-message" role="alert">
      {message}
    </p>
  )
}

export default ErrorMessage
