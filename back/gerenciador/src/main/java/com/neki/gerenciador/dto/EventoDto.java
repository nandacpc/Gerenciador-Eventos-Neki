package com.neki.gerenciador.dto;

import java.time.LocalDate;

import com.neki.gerenciador.model.Evento;

public record EventoDto(
	Long id,
	String nome,
	LocalDate data,
	String local,
	String imagem
	) {
	
	public Evento toEntity() {
		Evento evento = new Evento();
		evento.setId(this.id);
		evento.setNome(this.nome);
		evento.setData(this.data);
		evento.setLocal(this.local);
		evento.setImagem(this.imagem);
		return evento;
	}
	
	public static EventoDto toDto(Evento evento) {
		return new EventoDto(
			evento.getId(),
			evento.getNome(),
			evento.getData(),
			evento.getLocal(),
			evento.getImagem()
		);
	}
}
