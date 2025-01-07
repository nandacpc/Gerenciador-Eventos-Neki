package com.neki.gerenciador.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neki.gerenciador.dto.AdministradorDto;
import com.neki.gerenciador.model.Administrador;
import com.neki.gerenciador.repository.AdministradorRepository;

@Service
public class AdministradorService {

	@Autowired
	private AdministradorRepository repositorio;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public AdministradorDto salvarAdmin(AdministradorDto adminDto) {
		if (!adminDto.senha().equals(adminDto.confirmaSenha())) {
			throw new RuntimeException("Senhas não conferem");
		}
		
		validarCadastro(adminDto);
		
		Administrador admin = new Administrador();
		admin.setNome(adminDto.nome());
		admin.setEmail(adminDto.email());
		admin.setSenha(passwordEncoder.encode(adminDto.senha()));
		
		Administrador adminSalvo = repositorio.save(admin);
		
		return AdministradorDto.toDto(adminSalvo);
			
	}
	
	private void validarCadastro(AdministradorDto adminDto) {
		if (repositorio.existsByEmail(adminDto.email())) {
			throw new RuntimeException("Email ja cadastrado");
		}
	}
	
	
	
}
