package br.com.ticket.repository;

import br.com.ticket.domain.Assento;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Assento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssentoRepository extends JpaRepository<Assento, Long> {}
