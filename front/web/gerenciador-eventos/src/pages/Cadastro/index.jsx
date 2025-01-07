import { api } from "../../services/api";

export function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const salvarUsuario = async () => {
    e.preventDefault();

    const usuario = {
      email: email,
      nome: nome,
      senha: senha,
    };

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }
    try {
      const response = await api.post("/administrador", usuario);
      console.log("Usuário cadastrado com sucesso.", response.data);
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
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
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </>
  );
}
