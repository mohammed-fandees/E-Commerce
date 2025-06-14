import SessionProvider from './services/supabase/auth';
import AppRouter from "./routes/AppRouter";
import './styles/App.css';

export default function App() {
  return (
    <SessionProvider>
        <AppRouter />
    </SessionProvider>
  );
}
