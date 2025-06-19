import SessionProvider from './services/supabase/auth';
import AppRouter from "./routes/AppRouter";
import './styles/App.css';
import { Toaster } from 'sonner';
import { CartProvider } from './store/CartContext';
import { WishlistProvider } from './store/WishlistContext';

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <AppRouter />
          <Toaster position="top-center" richColors />
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}
