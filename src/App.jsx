import SessionProvider from './services/supabase/auth';
import AppRouter from "./routes/AppRouter";
import './App.css';

export default function App() {
  return (
    <SessionProvider>
      <AppRouter />
    </SessionProvider>
  );
}
