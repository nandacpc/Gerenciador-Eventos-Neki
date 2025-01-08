package com.neki.gerenciador.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.neki.gerenciador.dto.EventoCadastroDto;
import com.neki.gerenciador.dto.EventoDto;
import com.neki.gerenciador.model.Administrador;
import com.neki.gerenciador.model.Evento;
import com.neki.gerenciador.repository.AdministradorRepository;
import com.neki.gerenciador.repository.EventoRepository;

@Service
public class EventoService {
	
	@Autowired
	private EventoRepository repositorio;
	
	@Autowired
	private AdministradorRepository adminRepositorio;
	
	public List<EventoDto> listarEventos(String emailAdmin) {
	    Administrador admin = adminRepositorio.findByEmail(emailAdmin)
	            .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));
	    return repositorio.findByAdmin(admin).stream()
	            .map(EventoDto::toDto)
	            .collect(Collectors.toList());
	}
	
	public EventoDto salvarEvento(EventoCadastroDto eventoDto) {
		String emailAdmin = SecurityContextHolder.getContext().getAuthentication().getName();
		
		Administrador adminEmail = adminRepositorio.findByEmail(emailAdmin)
	            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
		
		Administrador admin = adminRepositorio.findById(adminEmail.getId())
				.orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
		
		Evento novoEvento = new Evento();
		novoEvento.setNome(eventoDto.nome());
		novoEvento.setDataEvento(eventoDto.data_evento());
		novoEvento.setLocalizacao(eventoDto.localizacao());
		novoEvento.setImagem(eventoDto.imagem());
		novoEvento.setAdmin(admin);
		
		Evento eventoSalvo = repositorio.save(novoEvento);
		return EventoDto.toDto(eventoSalvo);
	}
	
	public Optional<EventoDto> alterarEvento(Long id, EventoCadastroDto eventoDto){
		if(!repositorio.existsById(id)) {
			return Optional.empty();
		}
		
		Evento evento = repositorio.findById(id).get();
		evento.setNome(eventoDto.nome());
		evento.setDataEvento(eventoDto.data_evento());
		evento.setLocalizacao(eventoDto.localizacao());
		evento.setImagem(eventoDto.imagem());
		
		Evento eventoAlterado = repositorio.save(evento);
		return Optional.of(EventoDto.toDto(eventoAlterado));
	}
	
	public boolean deletarEvento(Long eventoId, String emailAdmin) {
	    Administrador admin = adminRepositorio.findByEmail(emailAdmin)
	            .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

	    Evento evento = repositorio.findById(eventoId)
	            .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

	    if (!evento.getAdmin().equals(admin)) {
	        throw new RuntimeException("Acesso negado");
	    }

	    repositorio.delete(evento);
	    return true;
	}
}
