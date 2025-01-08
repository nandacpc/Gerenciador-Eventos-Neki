package com.neki.gerenciador.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="evento")
public class Evento {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id")
	private Long id;
	
	@NotBlank(message="O nome do evento deve ser informado.")
	@Column(name="nome")
	private String nome;
	
	@NotBlank(message="O local do evento deve ser informado.")
	@Column(name="localizacao")
	private String localizacao;
	
	@NotNull(message = "A data do evento deve ser informada.")
	@Future(message = "A data do evento deve ser posterior a data atual.")
	@Column(name="data_evento")
	private LocalDate data_evento;
	
	@Column(name="imagem")
	private String imagem;
	
	@ManyToOne
	@JoinColumn(name="id_admin")
	Administrador admin;

	
	//GETTERS E SETTERS
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getLocalizacao() {
		return localizacao;
	}

	public void setLocalizacao(String localizacao) {
		this.localizacao = localizacao;
	}

	public LocalDate getDataEvento() {
		return data_evento;
	}

	public void setDataEvento(LocalDate data_evento) {
		this.data_evento = data_evento;
	}

	public String getImagem() {
		return imagem;
	}

	public void setImagem(String imagem) {
		this.imagem = imagem;
	}

	public Administrador getAdmin() {
		return admin;
	}

	public void setAdmin(Administrador admin) {
		this.admin = admin;
	}
	
}
