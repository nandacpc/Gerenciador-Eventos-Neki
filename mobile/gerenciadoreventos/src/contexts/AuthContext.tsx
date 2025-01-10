// import { createContext, useContext, useEffect, useState } from "react";
// import { AuthContextProps, AuthProviderProps } from "../types/authType";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import api from "../services/api";

// export const AuthContext = createContext<AuthContextProps>({
//   user: null,
//   signIn: async () => {},
//   signOut: () => {},
// });

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<string | null>(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       const storedUser = await AsyncStorage.getItem("@user");
//       if (storedUser) setUser(JSON.parse(storedUser));
//     };
//     loadUser();
//   }, []);

//   const signIn = async (email: string, senha: string) => {
//     try {
//       const response = await api.post("/administrador/login", { email, senha });

//       const token = response.data.token;

//       if (token) {
//         await AsyncStorage.setItem("user", email);
//         await AsyncStorage.setItem("token", token);
//         setUser(email);
//       }
//     } catch (error) {
//       console.error("Erro ao autenticar:", error);
//     }
//   };

//   const signOut = async () => {
//     await AsyncStorage.removeItem("user");
//     await AsyncStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context)
//     throw new Error("useAuth deve ser usado dentro de AuthProvider");
//   return context;
// };
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { AuthContextProps, AuthProviderProps } from "../types/authType";

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  signIn: async () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(storedUser);
    };
    loadUserData();
  }, []);

  const signIn = async (email: string, senha: string) => {
    try {
      const response = await api.post("/administrador/login", { email, senha });
      const token = response.data.token;

      if (token) {
        await AsyncStorage.setItem("user", email);
        await AsyncStorage.setItem("token", token);
        setUser(email);
      }
    } catch (error) {
      console.error("Erro ao autenticar:", error);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
