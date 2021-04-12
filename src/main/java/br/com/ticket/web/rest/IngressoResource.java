package br.com.ticket.web.rest;

import br.com.ticket.domain.Ingresso;
import br.com.ticket.repository.IngressoRepository;
import br.com.ticket.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.ticket.domain.Ingresso}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class IngressoResource {

    private final Logger log = LoggerFactory.getLogger(IngressoResource.class);

    private static final String ENTITY_NAME = "ingresso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IngressoRepository ingressoRepository;

    public IngressoResource(IngressoRepository ingressoRepository) {
        this.ingressoRepository = ingressoRepository;
    }

    /**
     * {@code POST  /ingressos} : Create a new ingresso.
     *
     * @param ingresso the ingresso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ingresso, or with status {@code 400 (Bad Request)} if the ingresso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ingressos")
    public ResponseEntity<Ingresso> createIngresso(@RequestBody Ingresso ingresso) throws URISyntaxException {
        log.debug("REST request to save Ingresso : {}", ingresso);
        if (ingresso.getId() != null) {
            throw new BadRequestAlertException("A new ingresso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ingresso result = ingressoRepository.save(ingresso);
        return ResponseEntity
            .created(new URI("/api/ingressos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ingressos/:id} : Updates an existing ingresso.
     *
     * @param id the id of the ingresso to save.
     * @param ingresso the ingresso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ingresso,
     * or with status {@code 400 (Bad Request)} if the ingresso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ingresso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ingressos/{id}")
    public ResponseEntity<Ingresso> updateIngresso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ingresso ingresso
    ) throws URISyntaxException {
        log.debug("REST request to update Ingresso : {}, {}", id, ingresso);
        if (ingresso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ingresso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ingressoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ingresso result = ingressoRepository.save(ingresso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ingresso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ingressos/:id} : Partial updates given fields of an existing ingresso, field will ignore if it is null
     *
     * @param id the id of the ingresso to save.
     * @param ingresso the ingresso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ingresso,
     * or with status {@code 400 (Bad Request)} if the ingresso is not valid,
     * or with status {@code 404 (Not Found)} if the ingresso is not found,
     * or with status {@code 500 (Internal Server Error)} if the ingresso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ingressos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Ingresso> partialUpdateIngresso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ingresso ingresso
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ingresso partially : {}, {}", id, ingresso);
        if (ingresso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ingresso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ingressoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ingresso> result = ingressoRepository
            .findById(ingresso.getId())
            .map(
                existingIngresso -> {
                    if (ingresso.getIdIngresso() != null) {
                        existingIngresso.setIdIngresso(ingresso.getIdIngresso());
                    }
                    if (ingresso.getDataCompra() != null) {
                        existingIngresso.setDataCompra(ingresso.getDataCompra());
                    }
                    if (ingresso.getValor() != null) {
                        existingIngresso.setValor(ingresso.getValor());
                    }

                    return existingIngresso;
                }
            )
            .map(ingressoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ingresso.getId().toString())
        );
    }

    /**
     * {@code GET  /ingressos} : get all the ingressos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ingressos in body.
     */
    @GetMapping("/ingressos")
    public List<Ingresso> getAllIngressos() {
        log.debug("REST request to get all Ingressos");
        return ingressoRepository.findAll();
    }

    /**
     * {@code GET  /ingressos/:id} : get the "id" ingresso.
     *
     * @param id the id of the ingresso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ingresso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ingressos/{id}")
    public ResponseEntity<Ingresso> getIngresso(@PathVariable Long id) {
        log.debug("REST request to get Ingresso : {}", id);
        Optional<Ingresso> ingresso = ingressoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ingresso);
    }

    /**
     * {@code DELETE  /ingressos/:id} : delete the "id" ingresso.
     *
     * @param id the id of the ingresso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ingressos/{id}")
    public ResponseEntity<Void> deleteIngresso(@PathVariable Long id) {
        log.debug("REST request to delete Ingresso : {}", id);
        ingressoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
