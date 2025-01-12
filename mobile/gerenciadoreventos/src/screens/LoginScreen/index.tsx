import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { StackParamList } from "../../types/screensType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [gravarSenha, setGravarSenha] = useState(false);
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("savedEmail");
        const savedSenha = await AsyncStorage.getItem("savedSenha");
        const savedGravarSenha = await AsyncStorage.getItem("gravarSenha");

        if (savedEmail) setEmail(savedEmail);
        if (savedSenha) setSenha(savedSenha);
        if (savedGravarSenha === "true") setGravarSenha(true);
      } catch (error) {
        console.error("Erro ao carregar credenciais:", error);
      }
    };

    loadCredentials();
  }, []);
  const handleSignIn = async () => {
    try {
      await signIn(email, senha);
      if (gravarSenha) {
        await AsyncStorage.setItem("savedEmail", email);
        await AsyncStorage.setItem("savedSenha", senha);
        await AsyncStorage.setItem("gravarSenha", "true");
      } else {
        await AsyncStorage.removeItem("savedEmail");
        await AsyncStorage.removeItem("savedSenha");
        await AsyncStorage.setItem("gravarSenha", "false");
      }
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert(
        "Erro de login",
        "Email ou senha incorretos. Tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry={true}
            value={senha}
            onChangeText={(text) => setSenha(text)}
          />
          <View style={styles.switchContainer}>
            <Text>Gravar Senha</Text>
            <Switch
              value={gravarSenha}
              onValueChange={(value) => setGravarSenha(value)}
            />
          </View>
          <View style={styles.botoes}>
            <Pressable onPress={handleSignIn} style={styles.botao}>
              <Text style={styles.botaoText}>Entrar</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Cadastro")}
              style={styles.botao}
            >
              <Text style={styles.botaoText}>Cadastro</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
