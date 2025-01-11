import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./styles";
import { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../types/screensType";
import api from "../../services/api";

export function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const salvarUsuario = async () => {
    if (senha !== confirmaSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const usuario = { nome, email, senha, confirmaSenha };

    try {
      const response = await api.post("/administrador", usuario);
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      Alert.alert("Erro", "Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
        />
        <Pressable onPress={salvarUsuario} style={styles.botao}>
          <Text style={styles.botaoText}>Cadastrar</Text>
        </Pressable>
      </View>
    </View>
  );
}
