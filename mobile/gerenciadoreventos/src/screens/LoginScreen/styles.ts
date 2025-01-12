import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#19536e",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#eee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  botoes: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 32,
  },
  botao: {
    backgroundColor: "#19536e",
    padding: 16,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  botaoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
