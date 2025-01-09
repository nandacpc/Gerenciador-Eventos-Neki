package com.neki.gerenciador.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

public record EventoCadastroDto(
		String nome,
		LocalDate data_evento,
		String localizacao,
		MultipartFile imagem
		) {

}
