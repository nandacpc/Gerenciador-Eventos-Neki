package com.neki.gerenciador.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neki.gerenciador.model.Administrador;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {

	Optional<Administrador> findByEmail(String email);
	
	boolean existsByEmail(String email);
}
