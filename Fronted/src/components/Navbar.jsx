import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import logo from '../assets/logo.png';
import { FiShoppingCart, FiUser } from 'react-icons/fi';

const linkClass = ({ isActive }) =>
  `px-3 py-2 font-medium transition ${
    isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
  }`;

function Navbar() {
  const { isAuthed, signOut, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[85rem] items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span>SHOPPER</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/category/men" className={linkClass}>
            Men
          </NavLink>
          <NavLink to="/category/women" className={linkClass}>
            Women
          </NavLink>
          <NavLink to="/category/kids" className={linkClass}>
            Kids
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <NavLink to="/cart" className="relative px-2 py-2 text-slate-700 hover:text-slate-900">
            <FiShoppingCart className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </NavLink>
          {isAuthed ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                <FiUser className="h-4 w-4" />
                {user?.name ? <span className="hidden sm:inline">{user.name}</span> : null}
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white shadow-md z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/orders');
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                      navigate('/');
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
