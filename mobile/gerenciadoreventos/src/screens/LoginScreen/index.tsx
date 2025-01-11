import React, { useState } from "react";
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
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";
import { StackParamList } from "../../types/screensType";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleSignIn = async () => {
    try {
      await signIn(email, senha);
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
