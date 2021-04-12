package br.com.ticket.repository;

import br.com.ticket.domain.Teatro;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Teatro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TeatroRepository extends JpaRepository<Teatro, Long> {}
