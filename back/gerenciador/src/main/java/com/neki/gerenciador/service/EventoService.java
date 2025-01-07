package com.neki.gerenciador.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neki.gerenciador.dto.EventoDto;
import com.neki.gerenciador.model.Evento;
import com.neki.gerenciador.repository.EventoRepository;

@Service
public class EventoService {
	
	@Autowired
	private EventoRepository repositorio;
	
	public List<EventoDto> listarTodos() {
		return repositorio.findAll().stream().map(EventoDto::toDto).toList();
	}
	
	public EventoDto salvarEvento(EventoDto eventoDto) {
		Evento novoEvento = new Evento();
		novoEvento.setId(eventoDto.id());
		novoEvento.setNome(eventoDto.nome());
		novoEvento.setData(eventoDto.data());
		novoEvento.setLocal(eventoDto.local());
		novoEvento.setImagem(eventoDto.imagem());
		
		Evento eventoSalvo = repositorio.save(novoEvento);
		return EventoDto.toDto(eventoSalvo);
	}
	
	public Optional<EventoDto> alterarEvento(Long id, EventoDto eventoDto){
		if(!repositorio.existsById(id)) {
			return Optional.empty();
		}
		
		Evento evento = repositorio.findById(id).get();
		evento.setNome(eventoDto.nome());
		evento.setData(eventoDto.data());
		evento.setLocal(eventoDto.local());
		evento.setImagem(eventoDto.imagem());
		
		Evento eventoAlterado = repositorio.save(evento);
		return Optional.of(EventoDto.toDto(eventoAlterado));
	}
	
	public boolean deletarEvento(Long id) {
		if(!repositorio.existsById(id)) {
			return false;
		}
		repositorio.deleteById(id);
		return true;
	}

}
