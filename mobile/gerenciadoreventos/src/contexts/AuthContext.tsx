import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { AuthContextProps, AuthProviderProps } from "../types/authType";

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = JSON.parse(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            await AsyncStorage.removeItem("token");
            setToken(null);
            return;
          } else {
            setToken(storedToken);
          }
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
          await AsyncStorage.removeItem("token");
          setToken(null);
          return;
        }
      }
    };
    loadTokenData();
  }, []);

  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log("Token atual:", token);
    };
    verificarToken();
  }, [token]);

  const signIn = async (email: string, senha: string) => {
    try {
      const response = await api.post("/administrador/login", {
        email,
        senha,
      });
      const token = response.data.token;

      if (token) {
        setToken(token);
        await AsyncStorage.setItem("token", token);
      } else {
        throw new Error("Credenciais inválidas.");
      }
    } catch (error: any) {
      console.error("Erro ao autenticar:", error);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
