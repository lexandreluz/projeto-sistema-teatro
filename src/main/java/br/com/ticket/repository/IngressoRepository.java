package br.com.ticket.repository;

import br.com.ticket.domain.Ingresso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ingresso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IngressoRepository extends JpaRepository<Ingresso, Long> {}
