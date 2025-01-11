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
      if (storedToken) setToken(storedToken);
    };
    loadTokenData();
  }, []);

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
