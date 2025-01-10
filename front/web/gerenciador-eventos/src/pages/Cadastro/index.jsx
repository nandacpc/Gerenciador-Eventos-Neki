import styles from "./cadastro.module.css";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useState } from "react";
import { Label } from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";

export function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  const salvarUsuario = async (e) => {
    e.preventDefault();

    if (senha !== confirmaSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const usuario = {
      nome,
      email,
      senha,
      confirmaSenha,
    };

    try {
      const response = await api.post("/administrador", usuario);
      console.log("Usuário cadastrado com sucesso.", response.data);
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      console.log("Erro ao cadastrar usuário.", error);
      alert("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1>Cadastro</h1>
        <form onSubmit={salvarUsuario} className={styles.form}>
          <Label label="Nome" tagInput="nome" />
          <Input
            tagInput="nome"
            type="text"
            placeholder="Digite seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Label label="Email" tagInput="email" />
          <Input
            tagInput="email"
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
          <Label label="Confirmar Senha" tagInput="confirmarSenha" />
          <Input
            tagInput="confirmarSenha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmaSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </>
  );
}
