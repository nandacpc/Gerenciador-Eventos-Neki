import { useEffect, useState, createContext } from "react";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storageUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storageUser && token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } else {
          setUser(JSON.parse(storageUser));
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const signIn = async ({ email, senha }, lembrarMe) => {
    try {
      const response = await api.post("/administrador/login", { email, senha });
      const token = response.data.token;

      if (!token) {
        alert("Erro ao autenticar. Token não recebido.");
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        alert("Token recebido já expirado!");
        return;
      }

      setUser(email);
      if (lembrarMe) {
        localStorage.setItem("user", JSON.stringify(email));
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("user", JSON.stringify(email));
        sessionStorage.setItem("token", token);
      }
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
