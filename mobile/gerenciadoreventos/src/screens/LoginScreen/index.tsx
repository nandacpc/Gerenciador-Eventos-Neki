// import React, { useState } from "react";
// import {
//   Text,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   Platform,
//   Pressable,
// } from "react-native";
// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { styles } from "./styles";
// import { useAuth } from "../../contexts/AuthContext";
// import { StackParamList } from "../../types/screensType";

// export function LoginScreen() {
//   const { signIn } = useAuth();
//   const [email, setEmail] = useState("");
//   const [senha, setSenha] = useState("");
//   const [error, setError] = useState("");
//   const navigation = useNavigation<NavigationProp<StackParamList>>();

//   const handleSignIn = async () => {
//     setError("");
//     try {
//       await signIn(email, senha);
//       navigation.navigate("Home");
//     } catch (err) {
//       setError("Erro ao fazer login");

//       Alert.alert(
//         "Erro de login",
//         "Email ou senha incorretos. Tente novamente.",
//         [{ text: "OK" }]
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <Text style={styles.title}>Login</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Digite seu email"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Digite sua senha"
//           secureTextEntry
//           value={senha}
//           onChangeText={setSenha}
//         />
//         {error ? <Text style={styles.errorText}>{error}</Text> : null}
//         <Pressable style={styles.button} onPress={handleSignIn}>
//           <Text style={styles.buttonText}>Entrar</Text>
//         </Pressable>
//         <Pressable
//           style={styles.button}
//           onPress={() => navigation.navigate("Cadastro")}
//         >
//           <Text style={styles.buttonText}>Cadastrar</Text>
//         </Pressable>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { StackParamList } from "../../types/screensType";

export function LoginScreen() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const handleSignIn = async () => {
    await signIn(email, senha);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Entrar" onPress={handleSignIn} />
      <Button
        title="Cadastrar"
        onPress={() => navigation.navigate("Cadastro")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
});
