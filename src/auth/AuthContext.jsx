import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/auth'
import { clearToken, getToken, setToken, setUnauthorizedHandler } from '../api/client'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken())
  const navigate = useNavigate()
  const location = useLocation()

  const login = useCallback(async (username, password) => {
    const { token: newToken } = await loginRequest(username, password)
    setToken(newToken)
    setTokenState(newToken)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  // A 401 on a protected request: the client already cleared the token
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setTokenState(null)
      navigate('/login', { replace: true, state: { from: location, expired: true } })
    })
    return () => setUnauthorizedHandler(null)
  }, [navigate, location])

  const value = useMemo(
    () => ({ isAdmin: Boolean(token), login, logout }),
    [token, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
