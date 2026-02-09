import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const Signin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const validateEmail = (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) return 'Email is required'
    if (!pattern.test(value)) return 'Enter a valid email'
    return ''
  }

  const validatePassword = (value) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (emailErr || passwordErr) return

    setLoading(true)

    try {
      const res = await api.post('/auth/signin', { email, password })
      const { token, user } = res.data

      if (!user || user.role !== 'admin') {
        setError('Access denied — Admin only')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/dashboard')
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        setError(err.response.data?.message || 'Invalid email or password')
      } else {
        setError('Server error')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Admin Sign In
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(validateEmail(e.target.value))
              }}
            />
            {emailError && (
              <p className="text-xs text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError(validatePassword(e.target.value))
              }}
            />
            {passwordError && (
              <p className="text-xs text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60"
            disabled={loading || emailError || passwordError}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signin
