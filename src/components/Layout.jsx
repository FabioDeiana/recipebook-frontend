import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Rosemary } from './Doodles'

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
            Emma&apos;s Cookbook
          </Link>
          <nav className="main-nav">
            <NavLink to="/recipes" end>
              Recipes
            </NavLink>
            <NavLink to="/friends">Friends&apos; Recipes</NavLink>
            <NavLink to="/submit">Share a recipe</NavLink>
            {!isAdmin && (
              <NavLink to="/login" className="nav-signin">
                Sign in
              </NavLink>
            )}
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
        <div className="container footer-inner">
          <Rosemary className="footer-doodle" />
          <p className="dedication">
            Made with love for Emma, the best cook I know. <span className="heart">♥</span>
          </p>
          <Rosemary className="footer-doodle footer-doodle-right" />
        </div>
      </footer>
    </div>
  )
}

export default Layout
