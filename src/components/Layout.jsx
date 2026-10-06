import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

function Layout() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            RecipeBook
          </Link>
          <nav className="main-nav">
            <NavLink to="/" end>
              Recipes
            </NavLink>
            <NavLink to="/friends">Friends&apos; Recipes</NavLink>
            <NavLink to="/submit">Share a recipe</NavLink>
          </nav>
        </div>
        {isAdmin && (
          <div className="admin-bar">
            <div className="container admin-bar-inner">
              <NavLink to="/admin/recipes/new">New recipe</NavLink>
              <NavLink to="/admin/catalog">Categories &amp; tags</NavLink>
              <NavLink to="/admin/password">Password</NavLink>
              <button type="button" className="link-button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="container main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          {!isAdmin && (
            <Link to="/login" className="footer-link">
              Admin
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}

export default Layout
