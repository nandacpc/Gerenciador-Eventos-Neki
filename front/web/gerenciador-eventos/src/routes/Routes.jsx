import { Route, Routes } from "react-router-dom";
import { CadastroPage } from "../pages/Cadastro";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";

export function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
