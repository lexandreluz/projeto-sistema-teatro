package br.com.ticket.web.rest;

import br.com.ticket.domain.Assento;
import br.com.ticket.repository.AssentoRepository;
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
 * REST controller for managing {@link br.com.ticket.domain.Assento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AssentoResource {

    private final Logger log = LoggerFactory.getLogger(AssentoResource.class);

    private static final String ENTITY_NAME = "assento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AssentoRepository assentoRepository;

    public AssentoResource(AssentoRepository assentoRepository) {
        this.assentoRepository = assentoRepository;
    }

    /**
     * {@code POST  /assentos} : Create a new assento.
     *
     * @param assento the assento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new assento, or with status {@code 400 (Bad Request)} if the assento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/assentos")
    public ResponseEntity<Assento> createAssento(@RequestBody Assento assento) throws URISyntaxException {
        log.debug("REST request to save Assento : {}", assento);
        if (assento.getId() != null) {
            throw new BadRequestAlertException("A new assento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Assento result = assentoRepository.save(assento);
        return ResponseEntity
            .created(new URI("/api/assentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /assentos/:id} : Updates an existing assento.
     *
     * @param id the id of the assento to save.
     * @param assento the assento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assento,
     * or with status {@code 400 (Bad Request)} if the assento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the assento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/assentos/{id}")
    public ResponseEntity<Assento> updateAssento(@PathVariable(value = "id", required = false) final Long id, @RequestBody Assento assento)
        throws URISyntaxException {
        log.debug("REST request to update Assento : {}, {}", id, assento);
        if (assento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Assento result = assentoRepository.save(assento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, assento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /assentos/:id} : Partial updates given fields of an existing assento, field will ignore if it is null
     *
     * @param id the id of the assento to save.
     * @param assento the assento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assento,
     * or with status {@code 400 (Bad Request)} if the assento is not valid,
     * or with status {@code 404 (Not Found)} if the assento is not found,
     * or with status {@code 500 (Internal Server Error)} if the assento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/assentos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Assento> partialUpdateAssento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Assento assento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Assento partially : {}, {}", id, assento);
        if (assento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Assento> result = assentoRepository
            .findById(assento.getId())
            .map(
                existingAssento -> {
                    if (assento.getNumeracao() != null) {
                        existingAssento.setNumeracao(assento.getNumeracao());
                    }
                    if (assento.getStatus() != null) {
                        existingAssento.setStatus(assento.getStatus());
                    }

                    return existingAssento;
                }
            )
            .map(assentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, assento.getId().toString())
        );
    }

    /**
     * {@code GET  /assentos} : get all the assentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of assentos in body.
     */
    @GetMapping("/assentos")
    public List<Assento> getAllAssentos() {
        log.debug("REST request to get all Assentos");
        return assentoRepository.findAll();
    }

    /**
     * {@code GET  /assentos/:id} : get the "id" assento.
     *
     * @param id the id of the assento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the assento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/assentos/{id}")
    public ResponseEntity<Assento> getAssento(@PathVariable Long id) {
        log.debug("REST request to get Assento : {}", id);
        Optional<Assento> assento = assentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(assento);
    }

    /**
     * {@code DELETE  /assentos/:id} : delete the "id" assento.
     *
     * @param id the id of the assento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/assentos/{id}")
    public ResponseEntity<Void> deleteAssento(@PathVariable Long id) {
        log.debug("REST request to delete Assento : {}", id);
        assentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
