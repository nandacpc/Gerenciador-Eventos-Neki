package com.neki.gerenciador.dto;

import java.time.LocalDate;

import com.neki.gerenciador.model.Administrador;
import com.neki.gerenciador.model.Evento;

public record EventoDto(
	Long id,
	String nome,
	LocalDate data_evento,
	String localizacao,
	String imagem,
	Long id_admin
	) {
	
	public Evento toEntity() {
		Evento evento = new Evento();
		evento.setId(this.id);
		evento.setNome(this.nome);
		evento.setDataEvento(this.data_evento);
		evento.setLocalizacao(this.localizacao);
		evento.setImagem(this.imagem);
		Administrador admin = new Administrador();
		admin.setId(this.id_admin);
		evento.setAdmin(admin);
		return evento;
	}
	
	public static EventoDto toDto(Evento evento) {
		return new EventoDto(
			evento.getId(),
			evento.getNome(),
			evento.getDataEvento(),
			evento.getLocalizacao(),
			evento.getImagem(),
			evento.getAdmin().getId()
		);
	}
}
