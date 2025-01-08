import { Route, Router, Routes } from "react-router-dom";
import { CadastroPage } from "../pages/Cadastro";
import { HomePage } from "../pages/Home";
import { LoginPage } from "../pages/Login";

export function Rotas() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  );
}
