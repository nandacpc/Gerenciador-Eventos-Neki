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
import { evento, StackParamList } from "../../types/screensType";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const [eventos, setEventos] = useState<evento[]>([]);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [eventoAtual, setEventoAtual] = useState<evento | null>(null);
  const [novoEvento, setNovoEvento] = useState<Partial<evento>>({});
  const [imagemEvento, setImagemEvento] = useState<string | null>(null);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

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
    if (!novoEvento.data_evento) {
      Alert.alert("Erro", "Por favor, selecione uma data.");
      return;
    }

    const dataEscolhida = new Date(novoEvento.data_evento);
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    if (dataEscolhida < dataAtual) {
      Alert.alert(
        "Data inválida",
        "A data do evento deve ser posterior a hoje."
      );
      return;
    }
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
      const dataEscolhida = new Date(eventoAtual.data_evento);
      const dataAtual = new Date();
      dataAtual.setHours(0, 0, 0, 0);

      if (dataEscolhida < dataAtual) {
        Alert.alert(
          "Data inválida",
          "A data do evento deve ser posterior a hoje."
        );
        return;
      }
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
      const dataCorrigida = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const dataISO = dataCorrigida.toISOString().split("T")[0];
      setEventoAtual((prev) => ({ ...prev, data_evento: dataISO } as evento));
    }
  };

  const processarDataSelecionada = (selectedDate?: Date) => {
    if (!selectedDate) return null;

    const dataCorrigida = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );

    return dataCorrigida.toISOString().split("T")[0];
  };

  const deslogar = async () => {
    signOut();
    navigation.navigate("Login");
  };

  useEffect(() => {
    buscarEventos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciador de Eventos</Text>
        <Pressable onPress={deslogar}>
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
            <View style={styles.modal}>
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
                    setMostrarDatePicker(false);

                    const dataISO = processarDataSelecionada(selectedDate);
                    if (dataISO) {
                      setNovoEvento((prev) => ({
                        ...prev,
                        data_evento: dataISO,
                      }));
                    }
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
              <Pressable style={styles.botaoImagem} onPress={selecionarImagem}>
                <Text style={styles.botaoText}>Selecionar Imagem</Text>
              </Pressable>
              {imagemEvento && <Image source={{ uri: imagemEvento }} />}
              <View style={styles.botoes}>
                <Pressable
                  onPress={() => setModalAdicionar(false)}
                  style={styles.botaoCancelar}
                >
                  <Text>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.botaoSalvar} onPress={adicionarEvento}>
                  <Text>Salvar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {modalEditar && eventoAtual && (
        <Modal
          transparent={true}
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
