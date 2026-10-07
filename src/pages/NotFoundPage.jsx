import { Link } from 'react-router-dom'

function NotFoundPage({ message = "This page doesn't exist." }) {
  return (
    <section className="narrow center">
      <h1>Not found</h1>
      <p className="muted">{message}</p>
      <Link to="/" className="button">
        Back to home
      </Link>
    </section>
  )
}

export default NotFoundPage
