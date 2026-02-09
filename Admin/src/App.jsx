import { useLocation } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Admin from './Pages/Admin'
import Signin from './Pages/Signin'
import NotFound from "./Pages/NotFound"
import RequireAdmin from './utils/RequireAdmin'
import { ToastProvider } from './utils/ToastProvider'
import { Redirect } from "./utils/Redirect"

function App() {
  const location = useLocation()
  const showNavbar = location.pathname.startsWith('/dashboard')

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        {showNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/signin" element={<Redirect><Signin /></Redirect>} />
          <Route path="/dashboard/*" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}

export default App
