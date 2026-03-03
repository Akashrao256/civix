import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import OfficialRoute from "./components/OfficialRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import OfficialDashboard from "./pages/official/OfficialDashboard";
import PetitionsList from "./pages/petitions/PetitionsList";
import CreatePetition from "./pages/petitions/CreatePetition";
import EditPetition from "./pages/petitions/EditPetition";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Petition Routes */}
          <Route path="/petitions" element={<ProtectedRoute><PetitionsList /></ProtectedRoute>} />
          <Route path="/petitions/create" element={<ProtectedRoute><CreatePetition /></ProtectedRoute>} />
          <Route path="/petitions/:id/edit" element={<ProtectedRoute><EditPetition /></ProtectedRoute>} />

          {/* Official Routes */}
          <Route path="/official/dashboard" element={<OfficialRoute><OfficialDashboard /></OfficialRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}