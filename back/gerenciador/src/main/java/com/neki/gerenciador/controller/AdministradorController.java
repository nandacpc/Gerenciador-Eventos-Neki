package com.neki.gerenciador.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.neki.gerenciador.config.JwtUtil;
import com.neki.gerenciador.dto.AdministradorCadastroDto;
import com.neki.gerenciador.dto.AdministradorDto;
import com.neki.gerenciador.service.AdministradorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/administrador")
public class AdministradorController {
	@Autowired
	private AdministradorService service;
	
    @Autowired
    private JwtUtil jwtUtil;
	
	@Operation(summary="Cadastrar um novo usuário", description="Cria um novo usuário e retorna os detalhes do usuário criado")
	@PostMapping
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Administrador criado com sucesso"),
			@ApiResponse(responseCode = "400", description = "Erro ao criar um novo usuário")
	})
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<AdministradorDto> cadastrarUsuario(@Valid @RequestBody AdministradorCadastroDto adminDto){
		return ResponseEntity.ok(service.salvarAdmin(adminDto));
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> autenticar(@RequestBody AdministradorDto adminDto) {
	    String token = service.autenticar(adminDto.email(), adminDto.senha());
	    return ResponseEntity.ok(new AuthResponse(token));
	}

	static class AuthResponse {
	    private String token;

	    public AuthResponse(String token) {
	        this.token = token;
	    }

	    public String getToken() {
	        return token;
	    }
	}
}
