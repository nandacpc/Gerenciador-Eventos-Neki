package com.neki.gerenciador.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neki.gerenciador.config.JwtUtil;
import com.neki.gerenciador.dto.AdministradorCadastroDto;
import com.neki.gerenciador.dto.AdministradorDto;
import com.neki.gerenciador.model.Administrador;
import com.neki.gerenciador.repository.AdministradorRepository;

@Service
public class AdministradorService {

	@Autowired
	private AdministradorRepository repositorio;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
    @Autowired
    private JwtUtil jwtUtil;
	
	public AdministradorDto salvarAdmin(AdministradorCadastroDto adminDto) {
		System.out.println("Senha: " + adminDto.senha());
	    System.out.println("ConfirmaSenha: " + adminDto.confirmaSenha());
		
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
	
	private void validarCadastro(AdministradorCadastroDto adminDto) {
		if (repositorio.existsByEmail(adminDto.email())) {
			throw new RuntimeException("Email ja cadastrado");
		}
	}
	
	public String autenticar(String email, String senha) {
        Administrador admin = repositorio.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senha, admin.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        return jwtUtil.generateToken(email);
    }	
	
}
