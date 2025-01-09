import styles from "./login.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { Label } from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = {
      email,
      senha,
    };
    await signIn(data);
    navigate("/home");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/home");
    }
  }, [navigate]);
  return (
    <>
      <div className={styles.container}>
        <h1>Login</h1>
        <form onSubmit={handleSignIn} className={styles.form}>
          <Label label="Login" tagInput="login" />
          <Input
            tagInput="login"
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Label label="Senha" tagInput="senha" />
          <Input
            tagInput="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Label label="Lembre-se de mim" tagInput="lembrar-me" />
          <Input
            tagInput="lembrar-me"
            type="checkbox"
            placeholder=""
            value=""
            onChange={(e) => setLembrar(e.target.checked)}
          />
          <button type="submit">Entrar</button>
          <button type="button" onClick={() => navigate("/cadastro")}>
            Cadastrar
          </button>
        </form>
      </div>
    </>
  );
}
