import SessionProvider from './services/supabase/auth';
import AppRouter from "./routes/AppRouter";
import './styles/App.css';
import { Toaster } from 'sonner';
import { CartProvider } from './store/CartContext';

export default function App() {
  return (
    <SessionProvider>
      <CartProvider>
        <AppRouter />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </SessionProvider>
  );
}
