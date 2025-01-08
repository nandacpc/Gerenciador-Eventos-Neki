import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AuthProvider } from "./context/auth";
import { Rotas } from "./routes/Routes";

function App() {
  return (
    <>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </>
  );
}

export default App;
