import { useEffect, useState, createContext } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const loadingStoreData = async () => {
      const storageUser = localStorage.getItem("user");
      const storageEmail = localStorage.getItem("email");

      if (storageUser && storageEmail) {
        setUser(JSON.parse(storageUser));
        setEmail(JSON.parse(storageEmail));
      }
    };
    loadingStoreData();
  }, []);

  const signIn = async ({ email, senha }) => {
    try {
      const response = await api.post("/login", { email, senha });
      console.log("Token: ", response.data);

      if (response.data.error) {
        alert(response.data.error);
        return;
      }
      const { user } = response.data;
      setUser(user);
      setEmail(email);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", JSON.stringify(email));
    } catch (error) {
      console.log("Erro ao fazer login.", error);
      alert("Erro ao fazer login. Tente novamente.");
    }
  };

  const signOut = () => {
    setUser(null);
    setEmail(null);
    localStorage.removeItem("user");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ user, email, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
