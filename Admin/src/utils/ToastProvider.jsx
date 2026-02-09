import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, { duration = 3000 } = {}) => {
    setToast({ message })
    const id = setTimeout(() => setToast(null), duration)
    return () => clearTimeout(id)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
        {toast && (
          <div className="pointer-events-auto bg-red-100 px-4 py-2 rounded shadow">
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
