package br.com.ticket.web.rest;

import br.com.ticket.domain.Teatro;
import br.com.ticket.repository.TeatroRepository;
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
 * REST controller for managing {@link br.com.ticket.domain.Teatro}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeatroResource {

    private final Logger log = LoggerFactory.getLogger(TeatroResource.class);

    private static final String ENTITY_NAME = "teatro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeatroRepository teatroRepository;

    public TeatroResource(TeatroRepository teatroRepository) {
        this.teatroRepository = teatroRepository;
    }

    /**
     * {@code POST  /teatros} : Create a new teatro.
     *
     * @param teatro the teatro to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teatro, or with status {@code 400 (Bad Request)} if the teatro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teatros")
    public ResponseEntity<Teatro> createTeatro(@RequestBody Teatro teatro) throws URISyntaxException {
        log.debug("REST request to save Teatro : {}", teatro);
        if (teatro.getId() != null) {
            throw new BadRequestAlertException("A new teatro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Teatro result = teatroRepository.save(teatro);
        return ResponseEntity
            .created(new URI("/api/teatros/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teatros/:id} : Updates an existing teatro.
     *
     * @param id the id of the teatro to save.
     * @param teatro the teatro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teatro,
     * or with status {@code 400 (Bad Request)} if the teatro is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teatro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teatros/{id}")
    public ResponseEntity<Teatro> updateTeatro(@PathVariable(value = "id", required = false) final Long id, @RequestBody Teatro teatro)
        throws URISyntaxException {
        log.debug("REST request to update Teatro : {}, {}", id, teatro);
        if (teatro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teatro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teatroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Teatro result = teatroRepository.save(teatro);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teatro.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teatros/:id} : Partial updates given fields of an existing teatro, field will ignore if it is null
     *
     * @param id the id of the teatro to save.
     * @param teatro the teatro to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teatro,
     * or with status {@code 400 (Bad Request)} if the teatro is not valid,
     * or with status {@code 404 (Not Found)} if the teatro is not found,
     * or with status {@code 500 (Internal Server Error)} if the teatro couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teatros/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Teatro> partialUpdateTeatro(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Teatro teatro
    ) throws URISyntaxException {
        log.debug("REST request to partial update Teatro partially : {}, {}", id, teatro);
        if (teatro.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teatro.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teatroRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Teatro> result = teatroRepository
            .findById(teatro.getId())
            .map(
                existingTeatro -> {
                    if (teatro.getIdTeatro() != null) {
                        existingTeatro.setIdTeatro(teatro.getIdTeatro());
                    }
                    if (teatro.getNomeTeatro() != null) {
                        existingTeatro.setNomeTeatro(teatro.getNomeTeatro());
                    }
                    if (teatro.getEndereco() != null) {
                        existingTeatro.setEndereco(teatro.getEndereco());
                    }

                    return existingTeatro;
                }
            )
            .map(teatroRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teatro.getId().toString())
        );
    }

    /**
     * {@code GET  /teatros} : get all the teatros.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teatros in body.
     */
    @GetMapping("/teatros")
    public List<Teatro> getAllTeatros() {
        log.debug("REST request to get all Teatros");
        return teatroRepository.findAll();
    }

    /**
     * {@code GET  /teatros/:id} : get the "id" teatro.
     *
     * @param id the id of the teatro to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teatro, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teatros/{id}")
    public ResponseEntity<Teatro> getTeatro(@PathVariable Long id) {
        log.debug("REST request to get Teatro : {}", id);
        Optional<Teatro> teatro = teatroRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(teatro);
    }

    /**
     * {@code DELETE  /teatros/:id} : delete the "id" teatro.
     *
     * @param id the id of the teatro to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teatros/{id}")
    public ResponseEntity<Void> deleteTeatro(@PathVariable Long id) {
        log.debug("REST request to delete Teatro : {}", id);
        teatroRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
