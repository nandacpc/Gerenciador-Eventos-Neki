import AsyncStorage from "@react-native-async-storage/async-storage";
import { evento } from "../types/screensType";
import api from "./api";

export const getEventos = async (): Promise<evento[]> => {
  const { data } = await api.get("/evento");
  return data;
};

export const updateEvento = async (EventoEditado: evento): Promise<evento> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const { data } = await api.put(
      `/evento/${EventoEditado.id}`,
      EventoEditado,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    throw error;
  }
};
