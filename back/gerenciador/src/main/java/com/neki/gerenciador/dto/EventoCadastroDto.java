package com.neki.gerenciador.dto;

import java.time.LocalDate;

public record EventoCadastroDto(
		String nome,
		LocalDate data_evento,
		String localizacao,
		String imagem,
		Long id_admin
		) {

}
