import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

function RequireAuth() {
  const { isAdmin } = useAuth()
  const location = useLocation()

  if (!isAdmin) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

export default RequireAuth
