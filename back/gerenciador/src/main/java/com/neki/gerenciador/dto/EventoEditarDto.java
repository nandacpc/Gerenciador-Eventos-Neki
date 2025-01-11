package com.neki.gerenciador.dto;

import java.time.LocalDate;

public record EventoEditarDto(
		LocalDate data_evento,
		String localizacao
		) {

}
