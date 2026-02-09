import { FaHome, FaCartPlus, FaClipboardCheck, FaClipboardList } from "react-icons/fa"
import SidebarItem from "./SidebarItem"

const Sidebar = () => {
  return (
    <aside
      className="
        bg-white 
        pt-6 px-4 md:px-10 
        md:h-screen 
        flex flex-row md:flex-col 
        items-start 
        gap-4 md:gap-6
      "
    >
      <SidebarItem to="" icon={FaHome} label="Dashboard" />
      <SidebarItem to="addproduct" icon={FaCartPlus} label="Add Product" />
      <SidebarItem to="listproduct" icon={FaClipboardList} label="Products" />
      <SidebarItem to="orders" icon={FaClipboardCheck} label="Orders" />
    </aside>
  )
}

export default Sidebar
