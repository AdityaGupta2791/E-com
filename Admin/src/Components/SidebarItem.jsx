import { NavLink } from "react-router-dom"

const SidebarItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        w-[48px] md:w-[210px]
        flex items-center justify-center md:justify-start
        gap-0 md:gap-4
        px-3 py-3
        rounded-lg
        transition-all duration-200
        
        ${isActive
          ? "bg-red-200 text-gray-900"
          : "bg-red-100 text-gray-700 hover:bg-red-200 hover:text-gray-900"
        }
      `
      }
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </NavLink>
  )
}

export default SidebarItem
