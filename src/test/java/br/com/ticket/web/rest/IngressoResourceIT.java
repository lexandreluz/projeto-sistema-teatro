package br.com.ticket.web.rest;

import static br.com.ticket.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.ticket.IntegrationTest;
import br.com.ticket.domain.Ingresso;
import br.com.ticket.repository.IngressoRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link IngressoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IngressoResourceIT {

    private static final Integer DEFAULT_ID_INGRESSO = 1;
    private static final Integer UPDATED_ID_INGRESSO = 2;

    private static final ZonedDateTime DEFAULT_DATA_COMPRA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATA_COMPRA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_VALOR = 1D;
    private static final Double UPDATED_VALOR = 2D;

    private static final String ENTITY_API_URL = "/api/ingressos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private IngressoRepository ingressoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIngressoMockMvc;

    private Ingresso ingresso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ingresso createEntity(EntityManager em) {
        Ingresso ingresso = new Ingresso().idIngresso(DEFAULT_ID_INGRESSO).dataCompra(DEFAULT_DATA_COMPRA).valor(DEFAULT_VALOR);
        return ingresso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ingresso createUpdatedEntity(EntityManager em) {
        Ingresso ingresso = new Ingresso().idIngresso(UPDATED_ID_INGRESSO).dataCompra(UPDATED_DATA_COMPRA).valor(UPDATED_VALOR);
        return ingresso;
    }

    @BeforeEach
    public void initTest() {
        ingresso = createEntity(em);
    }

    @Test
    @Transactional
    void createIngresso() throws Exception {
        int databaseSizeBeforeCreate = ingressoRepository.findAll().size();
        // Create the Ingresso
        restIngressoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingresso)))
            .andExpect(status().isCreated());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeCreate + 1);
        Ingresso testIngresso = ingressoList.get(ingressoList.size() - 1);
        assertThat(testIngresso.getIdIngresso()).isEqualTo(DEFAULT_ID_INGRESSO);
        assertThat(testIngresso.getDataCompra()).isEqualTo(DEFAULT_DATA_COMPRA);
        assertThat(testIngresso.getValor()).isEqualTo(DEFAULT_VALOR);
    }

    @Test
    @Transactional
    void createIngressoWithExistingId() throws Exception {
        // Create the Ingresso with an existing ID
        ingresso.setId(1L);

        int databaseSizeBeforeCreate = ingressoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIngressoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingresso)))
            .andExpect(status().isBadRequest());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllIngressos() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        // Get all the ingressoList
        restIngressoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ingresso.getId().intValue())))
            .andExpect(jsonPath("$.[*].idIngresso").value(hasItem(DEFAULT_ID_INGRESSO)))
            .andExpect(jsonPath("$.[*].dataCompra").value(hasItem(sameInstant(DEFAULT_DATA_COMPRA))))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())));
    }

    @Test
    @Transactional
    void getIngresso() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        // Get the ingresso
        restIngressoMockMvc
            .perform(get(ENTITY_API_URL_ID, ingresso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ingresso.getId().intValue()))
            .andExpect(jsonPath("$.idIngresso").value(DEFAULT_ID_INGRESSO))
            .andExpect(jsonPath("$.dataCompra").value(sameInstant(DEFAULT_DATA_COMPRA)))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingIngresso() throws Exception {
        // Get the ingresso
        restIngressoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewIngresso() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();

        // Update the ingresso
        Ingresso updatedIngresso = ingressoRepository.findById(ingresso.getId()).get();
        // Disconnect from session so that the updates on updatedIngresso are not directly saved in db
        em.detach(updatedIngresso);
        updatedIngresso.idIngresso(UPDATED_ID_INGRESSO).dataCompra(UPDATED_DATA_COMPRA).valor(UPDATED_VALOR);

        restIngressoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIngresso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedIngresso))
            )
            .andExpect(status().isOk());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
        Ingresso testIngresso = ingressoList.get(ingressoList.size() - 1);
        assertThat(testIngresso.getIdIngresso()).isEqualTo(UPDATED_ID_INGRESSO);
        assertThat(testIngresso.getDataCompra()).isEqualTo(UPDATED_DATA_COMPRA);
        assertThat(testIngresso.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void putNonExistingIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ingresso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingresso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ingresso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ingresso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIngressoWithPatch() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();

        // Update the ingresso using partial update
        Ingresso partialUpdatedIngresso = new Ingresso();
        partialUpdatedIngresso.setId(ingresso.getId());

        partialUpdatedIngresso.idIngresso(UPDATED_ID_INGRESSO).valor(UPDATED_VALOR);

        restIngressoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngresso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngresso))
            )
            .andExpect(status().isOk());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
        Ingresso testIngresso = ingressoList.get(ingressoList.size() - 1);
        assertThat(testIngresso.getIdIngresso()).isEqualTo(UPDATED_ID_INGRESSO);
        assertThat(testIngresso.getDataCompra()).isEqualTo(DEFAULT_DATA_COMPRA);
        assertThat(testIngresso.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void fullUpdateIngressoWithPatch() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();

        // Update the ingresso using partial update
        Ingresso partialUpdatedIngresso = new Ingresso();
        partialUpdatedIngresso.setId(ingresso.getId());

        partialUpdatedIngresso.idIngresso(UPDATED_ID_INGRESSO).dataCompra(UPDATED_DATA_COMPRA).valor(UPDATED_VALOR);

        restIngressoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIngresso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedIngresso))
            )
            .andExpect(status().isOk());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
        Ingresso testIngresso = ingressoList.get(ingressoList.size() - 1);
        assertThat(testIngresso.getIdIngresso()).isEqualTo(UPDATED_ID_INGRESSO);
        assertThat(testIngresso.getDataCompra()).isEqualTo(UPDATED_DATA_COMPRA);
        assertThat(testIngresso.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void patchNonExistingIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ingresso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingresso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ingresso))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIngresso() throws Exception {
        int databaseSizeBeforeUpdate = ingressoRepository.findAll().size();
        ingresso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIngressoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ingresso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ingresso in the database
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIngresso() throws Exception {
        // Initialize the database
        ingressoRepository.saveAndFlush(ingresso);

        int databaseSizeBeforeDelete = ingressoRepository.findAll().size();

        // Delete the ingresso
        restIngressoMockMvc
            .perform(delete(ENTITY_API_URL_ID, ingresso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ingresso> ingressoList = ingressoRepository.findAll();
        assertThat(ingressoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
