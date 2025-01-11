import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  Modal,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { styles } from "./styles";
import { getEventos, updateEvento } from "../../services/eventosService";
import { evento } from "../../types/screensType";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";

export function HomeScreen() {
  const [eventos, setEventos] = useState<evento[]>([]);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [eventoAtual, setEventoAtual] = useState<evento | null>(null);
  const [novoEvento, setNovoEvento] = useState<Partial<evento>>({});
  const [imagemEvento, setImagemEvento] = useState<string | null>(null);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const { signOut } = useAuth();

  const buscarEventos = async () => {
    try {
      const eventosApi = await getEventos();
      const eventosOrdenados = eventosApi.sort((a: evento, b: evento) => {
        const dataA = new Date(a.data_evento);
        const dataB = new Date(b.data_evento);
        return dataA.getTime() - dataB.getTime();
      });
      setEventos(eventosOrdenados);
    } catch (error) {
      console.error("Erro ao buscar eventos.", error);
    }
  };

  const adicionarEvento = async () => {
    const formData = new FormData();
    if (imagemEvento) {
      const arquivo = {
        uri: imagemEvento,
        name: "evento.jpg",
        type: "image/jpeg",
      };
      formData.append("imagem", arquivo as unknown as Blob);
    }
    formData.append("nome", novoEvento.nome || "");
    formData.append("data_evento", novoEvento.data_evento || "");
    formData.append("localizacao", novoEvento.localizacao || "");

    try {
      await api.post("/evento", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModalAdicionar(false);
      buscarEventos();
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

  const deletarEvento = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Usuário não autenticado.");
      }
      await api.delete(`/evento/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEventos((prev) => prev.filter((evento) => evento.id !== id));
      console.log(`Evento com ID ${id} deletado com sucesso.`);
    } catch (error) {
      console.error("Erro ao deletar o evento:", error);
      throw error;
    }
  };

  const editarEvento = async () => {
    if (!eventoAtual) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const eventoAtualizado = {
        id: eventoAtual.id,
        nome: eventoAtual.nome,
        imagem: eventoAtual.imagem,
        data_evento: eventoAtual.data_evento,
        localizacao: eventoAtual.localizacao,
      };
      await updateEvento(eventoAtualizado);
      setModalEditar(false);
      buscarEventos();
    } catch (error) {
      console.error("Erro ao editar evento.", error);
    }
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagemEvento(result.assets[0].uri);
    }
  };

  const abrirModalEditar = (evento: evento) => {
    setEventoAtual({ ...evento });
    setModalEditar(true);
  };

  const formatarData = (dataISO: string) => {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const abrirDatePicker = () => {
    setMostrarDatePicker(true);
  };

  const aoSelecionarData = (event: any, selectedDate?: Date) => {
    setMostrarDatePicker(false);
    if (selectedDate) {
      const dataISO = selectedDate.toISOString().split("T")[0];
      setEventoAtual((prev) => ({ ...prev, data_evento: dataISO } as evento));
    }
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciador de Eventos</Text>
        <Pressable onPress={signOut}>
          <Text style={styles.botaoSair}>Logout</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => setModalAdicionar(true)}>
        <Text style={styles.botaoAdicionar}>Adicionar Evento</Text>
      </Pressable>

      <FlatList
        data={eventos}
        renderItem={({ item }) => (
          <View style={styles.list}>
            <View style={styles.card}>
              <Image
                style={styles.imagem}
                source={{
                  uri: `http://192.168.0.204:8080/images/${item.imagem}`,
                }}
              />
              <Text style={styles.data}>{formatarData(item.data_evento)}</Text>
              <Text style={styles.titulo}>{item.nome}</Text>
              <Text style={styles.endereco}>Endereço: {item.localizacao}</Text>
              <View style={styles.botoes}>
                <Pressable
                  onPress={() => deletarEvento(item.id!)}
                  style={styles.botaoExcluir}
                >
                  <Text style={styles.botaoText}>Excluir</Text>
                </Pressable>
                <Pressable
                  onPress={() => abrirModalEditar(item)}
                  style={styles.botaoEditar}
                >
                  <Text style={styles.botaoText}>Editar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id!.toString()}
      />

      {modalAdicionar && (
        <Modal
          transparent
          visible={modalAdicionar}
          onRequestClose={() => setModalAdicionar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modal, { backgroundColor: "#fff" }]}>
              <Text style={styles.modalTitle}>Adicionar Evento</Text>
              <TextInput
                placeholder="Nome do Evento"
                style={styles.input}
                onChangeText={(text) =>
                  setNovoEvento((prev) => ({ ...prev, nome: text }))
                }
              />
              <Pressable onPress={abrirDatePicker}>
                <TextInput
                  placeholder="Data"
                  style={styles.input}
                  editable={false}
                  value={novoEvento.data_evento}
                />
              </Pressable>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={
                    novoEvento.data_evento
                      ? new Date(novoEvento.data_evento)
                      : new Date()
                  }
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    aoSelecionarData(event, selectedDate);
                    setNovoEvento((prev) => ({
                      ...prev,
                      data_evento: selectedDate?.toISOString().split("T")[0],
                    }));
                  }}
                />
              )}
              <TextInput
                placeholder="Localização"
                style={styles.input}
                onChangeText={(text) =>
                  setNovoEvento((prev) => ({ ...prev, localizacao: text }))
                }
              />
              <Pressable onPress={selecionarImagem}>
                <Text style={styles.botaoImagem}>Selecionar Imagem</Text>
              </Pressable>
              {imagemEvento && (
                <Image
                  source={{ uri: imagemEvento }}
                  style={styles.previewImagem}
                />
              )}
              <View style={styles.botoes}>
                <Pressable onPress={() => setModalAdicionar(false)}>
                  <Text style={styles.botaoCancelar}>Cancelar</Text>
                </Pressable>
                <Pressable onPress={adicionarEvento}>
                  <Text style={styles.botaoSalvar}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {modalEditar && eventoAtual && (
        <Modal
          transparent
          visible={modalEditar}
          onRequestClose={() => setModalEditar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Editar Evento</Text>
              <Pressable onPress={abrirDatePicker}>
                <TextInput
                  value={eventoAtual.data_evento}
                  placeholder="Data"
                  style={styles.input}
                  editable={false}
                />
              </Pressable>
              {mostrarDatePicker && (
                <DateTimePicker
                  value={new Date(eventoAtual.data_evento || new Date())}
                  mode="date"
                  display="default"
                  onChange={aoSelecionarData}
                />
              )}
              <TextInput
                value={eventoAtual.localizacao}
                placeholder="Localização"
                style={styles.input}
                onChangeText={(text) =>
                  setEventoAtual(
                    (prev) => ({ ...prev, localizacao: text } as evento)
                  )
                }
              />
              <View style={styles.botoes}>
                <Pressable
                  onPress={() => setModalEditar(false)}
                  style={styles.botaoCancelar}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable onPress={editarEvento} style={styles.botaoSalvar}>
                  <Text>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
