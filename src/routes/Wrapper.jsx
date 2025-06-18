import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "@/store/SessionContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Wrapper({ children, prevent }) {
  const { loading, session } = useContext(SessionContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (prevent === "user") {
    return session ? <Navigate to="/" /> : <>{children}</>;
  } else if (prevent === "guest") {
    return session ? <>{children}</> : <Navigate to="/login" />;
  }
}
