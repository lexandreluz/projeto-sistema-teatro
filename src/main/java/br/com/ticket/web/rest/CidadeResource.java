package br.com.ticket.web.rest;

import br.com.ticket.domain.Cidade;
import br.com.ticket.repository.CidadeRepository;
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
 * REST controller for managing {@link br.com.ticket.domain.Cidade}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CidadeResource {

    private final Logger log = LoggerFactory.getLogger(CidadeResource.class);

    private static final String ENTITY_NAME = "cidade";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CidadeRepository cidadeRepository;

    public CidadeResource(CidadeRepository cidadeRepository) {
        this.cidadeRepository = cidadeRepository;
    }

    /**
     * {@code POST  /cidades} : Create a new cidade.
     *
     * @param cidade the cidade to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cidade, or with status {@code 400 (Bad Request)} if the cidade has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cidades")
    public ResponseEntity<Cidade> createCidade(@RequestBody Cidade cidade) throws URISyntaxException {
        log.debug("REST request to save Cidade : {}", cidade);
        if (cidade.getId() != null) {
            throw new BadRequestAlertException("A new cidade cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cidade result = cidadeRepository.save(cidade);
        return ResponseEntity
            .created(new URI("/api/cidades/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cidades/:id} : Updates an existing cidade.
     *
     * @param id the id of the cidade to save.
     * @param cidade the cidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cidade,
     * or with status {@code 400 (Bad Request)} if the cidade is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cidades/{id}")
    public ResponseEntity<Cidade> updateCidade(@PathVariable(value = "id", required = false) final Long id, @RequestBody Cidade cidade)
        throws URISyntaxException {
        log.debug("REST request to update Cidade : {}, {}", id, cidade);
        if (cidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cidade result = cidadeRepository.save(cidade);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cidade.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cidades/:id} : Partial updates given fields of an existing cidade, field will ignore if it is null
     *
     * @param id the id of the cidade to save.
     * @param cidade the cidade to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cidade,
     * or with status {@code 400 (Bad Request)} if the cidade is not valid,
     * or with status {@code 404 (Not Found)} if the cidade is not found,
     * or with status {@code 500 (Internal Server Error)} if the cidade couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cidades/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Cidade> partialUpdateCidade(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Cidade cidade
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cidade partially : {}, {}", id, cidade);
        if (cidade.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cidade.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!cidadeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cidade> result = cidadeRepository
            .findById(cidade.getId())
            .map(
                existingCidade -> {
                    if (cidade.getNomeCidade() != null) {
                        existingCidade.setNomeCidade(cidade.getNomeCidade());
                    }
                    if (cidade.getUf() != null) {
                        existingCidade.setUf(cidade.getUf());
                    }

                    return existingCidade;
                }
            )
            .map(cidadeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cidade.getId().toString())
        );
    }

    /**
     * {@code GET  /cidades} : get all the cidades.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of cidades in body.
     */
    @GetMapping("/cidades")
    public List<Cidade> getAllCidades() {
        log.debug("REST request to get all Cidades");
        return cidadeRepository.findAll();
    }

    /**
     * {@code GET  /cidades/:id} : get the "id" cidade.
     *
     * @param id the id of the cidade to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cidade, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cidades/{id}")
    public ResponseEntity<Cidade> getCidade(@PathVariable Long id) {
        log.debug("REST request to get Cidade : {}", id);
        Optional<Cidade> cidade = cidadeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cidade);
    }

    /**
     * {@code DELETE  /cidades/:id} : delete the "id" cidade.
     *
     * @param id the id of the cidade to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cidades/{id}")
    public ResponseEntity<Void> deleteCidade(@PathVariable Long id) {
        log.debug("REST request to delete Cidade : {}", id);
        cidadeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
