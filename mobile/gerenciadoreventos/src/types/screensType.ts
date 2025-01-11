export type StackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Home: undefined;
  AdicionarEvento: undefined;
  EditarEvento: {
    evento: evento;
  };
};

export type evento = {
  id?: number;
  nome: string;
  data_evento: any;
  localizacao: string;
  imagem: any;
};
