import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { Input } from "../../components/Input/Input";
import { api } from "../../services/api";

export function HomePage() {
  const [eventos, setEventos] = useState([]);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [eventoAtual, setEventoAtual] = useState(null);
  const [novoEvento, setNovoEvento] = useState({
    nome: "",
    data_evento: "",
    localizacao: "",
    imagem: "",
  });
  const [edicaoEvento, setEdicaoEvento] = useState({
    data_evento: "",
    localizacao: "",
  });

  useEffect(() => {
    api
      .get("/evento")
      .then((response) => {
        const eventosOrdenados = response.data.sort((a, b) => {
          const dataA = new Date(a.data_evento);
          const dataB = new Date(b.data_evento);
          return dataA - dataB;
        });
        setEventos(eventosOrdenados);
      })
      .catch((error) => {
        console.log("Erro ao carregar eventos.", error);
      });
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nome", novoEvento.nome);
      formData.append("data_evento", novoEvento.data_evento);
      formData.append("localizacao", novoEvento.localizacao);
      formData.append("imagem", novoEvento.imagem);

      const response = await api.post("/evento", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEventos([...eventos, response.data]);

      setNovoEvento({
        nome: "",
        data_evento: "",
        localizacao: "",
        imagem: null,
      });
      setModalAdicionar(false);
    } catch (error) {
      console.log("Erro ao adicionar evento.", error);
    }
  };

  const abrirModalEditar = (evento) => {
    setEventoAtual(evento);
    setEdicaoEvento({
      data_evento: evento.data_evento,
      localizacao: evento.localizacao,
    });
    setModalEditar(true);
  };

  const handleEditEvento = async (e) => {
    e.preventDefault();

    try {
      const updateEvento = { ...edicaoEvento };

      await api.put(`/evento/${eventoAtual.id}`, updateEvento);

      setEventos((prev) =>
        prev.map((evento) =>
          evento.id === eventoAtual.id ? { ...evento, ...updateEvento } : evento
        )
      );

      setModalEditar(false);
    } catch (error) {
      console.log("Erro ao editar evento.", error);
    }
  };

  const handleDeleteEvento = async (id) => {
    try {
      await api.delete(`/evento/${id}`);
      setEventos(eventos.filter((evento) => evento.id !== id));
    } catch (error) {
      console.log("Erro ao deletar evento.", error);
    }
  };

  function formatarData(dataISO) {
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <>
      <div className={styles.container}>
        <h1>Eventos</h1>
        <button
          className={styles.button_adicionar}
          onClick={() => setModalAdicionar(true)}
        >
          ADICIONAR EVENTO
        </button>
        <div className={styles.list}>
          {eventos.map((evento) => (
            <div key={evento.id} className={styles.item}>
              <div className={styles.conteudo}>
                <div className={styles.imagem}>
                  <img
                    src={`http://localhost:8080/images/${evento.imagem}`}
                    alt="imagem do evento"
                  />
                </div>
                <div className={styles.data}>
                  <p>{formatarData(evento.data_evento)}</p>
                </div>
                <p className={styles.titulo}>{evento.nome}</p>
                <div className={styles.endereco_div}>
                  <p className={styles.endereco}>Endereço:</p>
                  <p>{evento.localizacao}</p>
                </div>
              </div>
              <div className={styles.buttons}>
                <button
                  className={styles.button_excluir}
                  onClick={() => handleDeleteEvento(evento.id)}
                >
                  Excluir
                </button>
                <button
                  className={styles.button_editar}
                  onClick={() => abrirModalEditar(evento)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalAdicionar && (
          <div className={styles.modal_overlay}>
            <div className={styles.modal}>
              <button
                className={styles.closeButton}
                onClick={() => setModal(false)}
              >
                &times;
              </button>
              <h2>Novo evento</h2>
              <form onSubmit={handleAddEvent} className={styles.form}>
                <Input
                  tagInput="nome"
                  type="text"
                  placeholder="Nome"
                  value={novoEvento.nome}
                  onChange={(e) =>
                    setNovoEvento({ ...novoEvento, nome: e.target.value })
                  }
                />
                <Input
                  tagInput="data"
                  type="date"
                  placeholder="Data"
                  value={novoEvento.data_evento}
                  onChange={(e) =>
                    setNovoEvento({
                      ...novoEvento,
                      data_evento: e.target.value,
                    })
                  }
                />
                <Input
                  tagInput="local"
                  type="text"
                  placeholder="Local"
                  value={novoEvento.localizacao}
                  onChange={(e) =>
                    setNovoEvento({
                      ...novoEvento,
                      localizacao: e.target.value,
                    })
                  }
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setNovoEvento({ ...novoEvento, imagem: e.target.files[0] })
                  }
                />
                <div className={styles.botoes}>
                  <button onClick={() => setModal(false)}>Cancelar</button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalEditar && (
          <div className={styles.modal_overlay}>
            <div className={styles.modal}>
              <button
                className={styles.closeButton}
                onClick={() => setModalEditar(false)}
              >
                &times;
              </button>
              <h2>Editar evento</h2>
              <form onSubmit={handleEditEvento} className={styles.form}>
                <Input
                  tagInput="data"
                  type="date"
                  placeholder="Data"
                  value={edicaoEvento.data_evento}
                  onChange={(e) =>
                    setEdicaoEvento({
                      ...edicaoEvento,
                      data_evento: e.target.value,
                    })
                  }
                />
                <Input
                  tagInput="local"
                  type="text"
                  placeholder="Local"
                  value={edicaoEvento.localizacao}
                  onChange={(e) =>
                    setEdicaoEvento({
                      ...edicaoEvento,
                      localizacao: e.target.value,
                    })
                  }
                />
                <div className={styles.botoes}>
                  <button onClick={() => setModalEditar(false)}>
                    Cancelar
                  </button>
                  <button type="submit">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
