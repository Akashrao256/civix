import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OfficialRoute({ children }) {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (user?.role !== "official") return <Navigate to="/dashboard" replace />;
    return children;
}
