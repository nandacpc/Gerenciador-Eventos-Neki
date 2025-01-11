package com.neki.gerenciador.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neki.gerenciador.model.Administrador;
import com.neki.gerenciador.model.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {

	List<Evento> findByAdmin(Administrador admin);
}
