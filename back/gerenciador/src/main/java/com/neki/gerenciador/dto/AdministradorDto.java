package com.neki.gerenciador.dto;

import com.neki.gerenciador.model.Administrador;

public record AdministradorDto(
		Long id,
		String nome,
		String email,
		String senha
		) {
	
	public Administrador toEntity() {
		Administrador administrador = new Administrador();
		administrador.setId(this.id);
		administrador.setNome(this.nome);
		administrador.setEmail(this.email);
		administrador.setSenha(this.senha);		
		return administrador;
	}
	
	public static AdministradorDto toDto(Administrador administrador) {
		return new AdministradorDto(
				administrador.getId(),
				administrador.getNome(),
				administrador.getEmail(),
				administrador.getSenha()
				);
	}
}
