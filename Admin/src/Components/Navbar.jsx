import { useNavigate } from 'react-router-dom'
import navlogo from '../assets/nav-logo.svg'
import navProfile from '../assets/nav-profile.svg'
import { useToast } from '../utils/ToastProvider'

const Navbar = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch {}

    showToast('Logged out')
    navigate('/signin', { replace: true })
  }

  return (
    <header className="
      flex items-center justify-between
      px-4 md:px-10 py-4
      bg-white
      shadow-sm
      sticky top-0 z-20
    ">
      <img 
        src={navlogo} 
        alt="Admin Panel" 
        className="w-[140px] md:w-[190px]"
      />

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={handleLogout}
          className="
            px-3 py-2 md:px-4 md:py-2
            rounded-lg
            bg-red-100 
            text-gray-800
            hover:bg-red-200 
            hover:text-gray-900
            transition-all duration-200
            text-sm font-medium
          "
        >
          Logout
        </button>

        <img 
          src={navProfile} 
          alt="Profile"
          className="w-10 md:w-12 rounded-full object-cover"
        />
      </div>
    </header>
  )
}

export default Navbar
