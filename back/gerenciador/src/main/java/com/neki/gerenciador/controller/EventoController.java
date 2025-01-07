package com.neki.gerenciador.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neki.gerenciador.dto.EventoDto;
import com.neki.gerenciador.service.EventoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/evento")
public class EventoController {
	
	@Autowired
	private EventoService service;
	
	@GetMapping
	@Operation(summary = "Retorna todos os eventos.", description = "Exibe uma lista de todos os eventos com as informações gerais.")
	@ApiResponse(responseCode = "200", description = "Eventos localizados.")
	public List<EventoDto> listarTodos() {
		return service.listarTodos();
	}
	
	@PostMapping
	@Operation(summary = "Cadastrar um novo evento.", description = "Cria um novo evento e retorna os detalhes do evento criado.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "400", description = "Erro ao criar um novo evento."),
		@ApiResponse(responseCode = "201", description = "Evento criado.")
	})
	public ResponseEntity<EventoDto> cadastrarEvento(@Valid @RequestBody EventoDto eventoDto) {
		return ResponseEntity.ok(service.salvarEvento(eventoDto));
	}
	
	@PutMapping("/{id}")
	@Operation(summary = "Alterar um evento.", description = "Altera um evento e retorna os detalhes do evento alterado.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "404", description = "Nao foi encontrado o evento pelo id informado. Verifique!"),
		@ApiResponse(responseCode = "200", description = "Evento alterado.")
	})
	public ResponseEntity<EventoDto> alterarEvento(@PathVariable Long id, @Valid @RequestBody EventoDto eventoDto) {
		Optional<EventoDto> eventoAlterado = service.alterarEvento(id, eventoDto);
		
		if (!eventoAlterado.isPresent()) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.ok(eventoAlterado.get());
	}
	
	@DeleteMapping("{/id}")
	public ResponseEntity<Void> deletarEvento(@PathVariable Long id) {
		if (!service.deletarEvento(id)) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.noContent().build();
	}

}
