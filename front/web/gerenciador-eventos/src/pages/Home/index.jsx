import { useEffect } from "react";
import { Label } from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";

export function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [modal, setModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    nome: "",
    data: "",
    local: "",
    imagem: null,
  });

  useEffect(() => {
    api
      .get("/eventos")
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.log("Erro ao carregar eventos.", error);
      });
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/eventos", novoEvento);
      setEventos([...eventos, response.data]);
      setNovoEvento({
        nome: "",
        data: "",
        local: "",
        imagem: null,
      });
      setModal(false);
    } catch (error) {
      console.log("Erro ao adicionar evento.", error);
    }
  };

  return (
    <div>
      <h1>Eventos</h1>
      <ul>
        {eventos.map((evento) => (
          <li key={evento.id}>
            <img src={evento.imagem} alt={evento.nome} />
            <p>{evento.nome}</p>
            <p>{evento.data}</p>
            <p>{evento.local}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => setModal(true)}>Adicionar evento</button>
      {modal && (
        <div>
          <h2>Novo evento</h2>
          <form onSubmit={handleAddEvent}>
            <Label label="Nome" tagInput="nome" />
            <Input
              tagInput="nome"
              type="text"
              placeholder="Nome"
              value={novoEvento.nome}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, nome: e.target.value })
              }
            />
            <Label label="Data" tagInput="data" />
            <Input
              tagInput="data"
              type="date"
              placeholder="Data"
              value={novoEvento.data}
            />
            <Label label="Local" tagInput="local" />
            <Input
              tagInput="local"
              type="text"
              placeholder="Local"
              value={novoEvento.local}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, local: e.target.value })
              }
            />
            <Label label="Imagem" tagInput="imagem" />
            <Input
              tagInput="imagem"
              type="file"
              placeholder="Imagem"
              value={novoEvento.imagem}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, imagem: e.target.value })
              }
            />
            <button type="submit">Salvar</button>
            <button onClick={() => setModal(false)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
