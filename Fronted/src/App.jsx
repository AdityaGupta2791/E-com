import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Auth from './pages/Auth.jsx';
import NotFound from './pages/NotFound.jsx';
import AppProviders from './context/AppProviders.jsx';
import RequireAuth from './components/RequireAuth.jsx';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <Orders />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
