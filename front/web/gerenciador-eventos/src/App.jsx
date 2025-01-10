import "./App.css";
import { AuthProvider } from "./context/auth";
import { Rotas } from "./routes/Routes";
import { Navbar } from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <Rotas />
      </AuthProvider>
    </>
  );
}

export default App;
