import SessionProvider from './services/supabase/auth';
import AppRouter from "./routes/AppRouter";
import './styles/App.css';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <SessionProvider>
        <AppRouter />
        <Toaster position="top-center" richColors />
    </SessionProvider>
  );
}
