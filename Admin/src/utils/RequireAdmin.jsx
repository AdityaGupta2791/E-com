import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from '../api'

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true

    const logoutAndRedirect = () => {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch {
        // ignore storage errors
      }
      navigate('/signin', { replace: true })
    }

    const verifyAdmin = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        if (mounted) setCheckingAuth(false)
        return logoutAndRedirect()
      }

      try {
        const res = await api.get('/auth/me')
        const freshUser = res?.data?.user
        if (!freshUser || freshUser.role !== 'admin') {
          if (mounted) setCheckingAuth(false)
          return logoutAndRedirect()
        }
        // persist fresh user info
        try {
          localStorage.setItem('user', JSON.stringify(freshUser))
        } catch {
          // ignore storage errors
        }
        if (mounted) setCheckingAuth(false)
      } catch {
        // on any error (including 401), fall back to logout
        if (mounted) setCheckingAuth(false)
        return logoutAndRedirect()
      }
    }

    verifyAdmin()

    return () => {
      mounted = false
    }
  }, [navigate])

  if (checkingAuth) return null

  return children
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
}

export default RequireAdmin
