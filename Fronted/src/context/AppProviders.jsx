import { AuthProvider } from './AuthContext.jsx';
import { CartProvider } from './CartContext.jsx';
import { ProductProvider } from './ProductContext.jsx';
import { ToastProvider } from './ToastContext.jsx';

function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>{children}</CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default AppProviders;
