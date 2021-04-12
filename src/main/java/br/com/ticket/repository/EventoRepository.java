package br.com.ticket.repository;

import br.com.ticket.domain.Evento;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Evento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {}
