package br.com.ticket.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.ticket.IntegrationTest;
import br.com.ticket.domain.Assento;
import br.com.ticket.repository.AssentoRepository;
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
 * Integration tests for the {@link AssentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssentoResourceIT {

    private static final Integer DEFAULT_NUMERACAO = 1;
    private static final Integer UPDATED_NUMERACAO = 2;

    private static final Boolean DEFAULT_STATUS = false;
    private static final Boolean UPDATED_STATUS = true;

    private static final String ENTITY_API_URL = "/api/assentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AssentoRepository assentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssentoMockMvc;

    private Assento assento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assento createEntity(EntityManager em) {
        Assento assento = new Assento().numeracao(DEFAULT_NUMERACAO).status(DEFAULT_STATUS);
        return assento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Assento createUpdatedEntity(EntityManager em) {
        Assento assento = new Assento().numeracao(UPDATED_NUMERACAO).status(UPDATED_STATUS);
        return assento;
    }

    @BeforeEach
    public void initTest() {
        assento = createEntity(em);
    }

    @Test
    @Transactional
    void createAssento() throws Exception {
        int databaseSizeBeforeCreate = assentoRepository.findAll().size();
        // Create the Assento
        restAssentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assento)))
            .andExpect(status().isCreated());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeCreate + 1);
        Assento testAssento = assentoList.get(assentoList.size() - 1);
        assertThat(testAssento.getNumeracao()).isEqualTo(DEFAULT_NUMERACAO);
        assertThat(testAssento.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createAssentoWithExistingId() throws Exception {
        // Create the Assento with an existing ID
        assento.setId(1L);

        int databaseSizeBeforeCreate = assentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssentoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assento)))
            .andExpect(status().isBadRequest());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAssentos() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        // Get all the assentoList
        restAssentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assento.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeracao").value(hasItem(DEFAULT_NUMERACAO)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.booleanValue())));
    }

    @Test
    @Transactional
    void getAssento() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        // Get the assento
        restAssentoMockMvc
            .perform(get(ENTITY_API_URL_ID, assento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(assento.getId().intValue()))
            .andExpect(jsonPath("$.numeracao").value(DEFAULT_NUMERACAO))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAssento() throws Exception {
        // Get the assento
        restAssentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAssento() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();

        // Update the assento
        Assento updatedAssento = assentoRepository.findById(assento.getId()).get();
        // Disconnect from session so that the updates on updatedAssento are not directly saved in db
        em.detach(updatedAssento);
        updatedAssento.numeracao(UPDATED_NUMERACAO).status(UPDATED_STATUS);

        restAssentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAssento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAssento))
            )
            .andExpect(status().isOk());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
        Assento testAssento = assentoList.get(assentoList.size() - 1);
        assertThat(testAssento.getNumeracao()).isEqualTo(UPDATED_NUMERACAO);
        assertThat(testAssento.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, assento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssentoWithPatch() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();

        // Update the assento using partial update
        Assento partialUpdatedAssento = new Assento();
        partialUpdatedAssento.setId(assento.getId());

        partialUpdatedAssento.numeracao(UPDATED_NUMERACAO);

        restAssentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssento))
            )
            .andExpect(status().isOk());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
        Assento testAssento = assentoList.get(assentoList.size() - 1);
        assertThat(testAssento.getNumeracao()).isEqualTo(UPDATED_NUMERACAO);
        assertThat(testAssento.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateAssentoWithPatch() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();

        // Update the assento using partial update
        Assento partialUpdatedAssento = new Assento();
        partialUpdatedAssento.setId(assento.getId());

        partialUpdatedAssento.numeracao(UPDATED_NUMERACAO).status(UPDATED_STATUS);

        restAssentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssento))
            )
            .andExpect(status().isOk());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
        Assento testAssento = assentoList.get(assentoList.size() - 1);
        assertThat(testAssento.getNumeracao()).isEqualTo(UPDATED_NUMERACAO);
        assertThat(testAssento.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, assento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAssento() throws Exception {
        int databaseSizeBeforeUpdate = assentoRepository.findAll().size();
        assento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssentoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(assento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Assento in the database
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAssento() throws Exception {
        // Initialize the database
        assentoRepository.saveAndFlush(assento);

        int databaseSizeBeforeDelete = assentoRepository.findAll().size();

        // Delete the assento
        restAssentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, assento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Assento> assentoList = assentoRepository.findAll();
        assertThat(assentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
