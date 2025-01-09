import { useEffect, useState, createContext } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storageUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storageUser && token) {
      setUser(JSON.parse(storageUser));
    }
  }, []);

  const signIn = async ({ email, senha }) => {
    try {
      const response = await api.post("/administrador/login", { email, senha });
      const token = response.data.token;

      if (!token) {
        alert("Erro ao autenticar. Token não recebido.");
        return;
      }

      setUser(email);
      localStorage.setItem("user", JSON.stringify(email));
      localStorage.setItem("token", token);
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
