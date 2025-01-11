import { Text, View } from "react-native";
import { styles } from "./styles";
import { useState } from "react";

export function HomeScreen() {
  const [eventos, setEventos] = useState([]);
  const [modal, setModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    nome: "",
    data_evento: "",
    localizacao: "",
    imagem: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
}
