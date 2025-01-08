import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { Label } from "../../components/Label/Label";
import { Input } from "../../components/Input/Input";
import { api } from "../../services/api";

export function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [modal, setModal] = useState(false);
  const [novoEvento, setNovoEvento] = useState({
    nome: "",
    data_evento: "",
    localizacao: "",
    imagem: "",
  });

  useEffect(() => {
    api
      .get("/evento")
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
      const response = await api.post("/evento", novoEvento);
      setEventos([...eventos, response.data]);
      setNovoEvento({
        nome: "",
        data_evento: "",
        localizacao: "",
        imagem: "",
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
            <img src={evento.imagem} alt="imagem" />
            <p>{evento.nome}</p>
            <p>{evento.data_evento}</p>
            <p>{evento.localizacao}</p>
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
              value={novoEvento.data_evento}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, data_evento: e.target.value })
              }
            />
            <Label label="Local" tagInput="local" />
            <Input
              tagInput="local"
              type="text"
              placeholder="Local"
              value={novoEvento.localizacao}
              onChange={(e) =>
                setNovoEvento({ ...novoEvento, localizacao: e.target.value })
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
