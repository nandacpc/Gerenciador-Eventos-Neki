import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import StackNavigator from "./src/navigation/StackNavigator";
import { LoginScreen } from "./src/screens/LoginScreen";

export default function App() {
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  );
}
