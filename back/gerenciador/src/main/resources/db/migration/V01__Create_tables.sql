CREATE TABLE administrador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR NOT NULL    
);

CREATE TABLE evento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    localizacao VARCHAR NOT NULL,
    data_evento DATE NOT NULL,
    imagem VARCHAR,
	id_admin INTEGER NOT NULL REFERENCES administrador(id)
);