import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-[85rem] px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
