package br.com.ticket.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.ticket.IntegrationTest;
import br.com.ticket.domain.Teatro;
import br.com.ticket.repository.TeatroRepository;
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
 * Integration tests for the {@link TeatroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TeatroResourceIT {

    private static final Integer DEFAULT_ID_TEATRO = 1;
    private static final Integer UPDATED_ID_TEATRO = 2;

    private static final String DEFAULT_NOME_TEATRO = "AAAAAAAAAA";
    private static final String UPDATED_NOME_TEATRO = "BBBBBBBBBB";

    private static final String DEFAULT_ENDERECO = "AAAAAAAAAA";
    private static final String UPDATED_ENDERECO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/teatros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TeatroRepository teatroRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeatroMockMvc;

    private Teatro teatro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teatro createEntity(EntityManager em) {
        Teatro teatro = new Teatro().idTeatro(DEFAULT_ID_TEATRO).nomeTeatro(DEFAULT_NOME_TEATRO).endereco(DEFAULT_ENDERECO);
        return teatro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teatro createUpdatedEntity(EntityManager em) {
        Teatro teatro = new Teatro().idTeatro(UPDATED_ID_TEATRO).nomeTeatro(UPDATED_NOME_TEATRO).endereco(UPDATED_ENDERECO);
        return teatro;
    }

    @BeforeEach
    public void initTest() {
        teatro = createEntity(em);
    }

    @Test
    @Transactional
    void createTeatro() throws Exception {
        int databaseSizeBeforeCreate = teatroRepository.findAll().size();
        // Create the Teatro
        restTeatroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teatro)))
            .andExpect(status().isCreated());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeCreate + 1);
        Teatro testTeatro = teatroList.get(teatroList.size() - 1);
        assertThat(testTeatro.getIdTeatro()).isEqualTo(DEFAULT_ID_TEATRO);
        assertThat(testTeatro.getNomeTeatro()).isEqualTo(DEFAULT_NOME_TEATRO);
        assertThat(testTeatro.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
    }

    @Test
    @Transactional
    void createTeatroWithExistingId() throws Exception {
        // Create the Teatro with an existing ID
        teatro.setId(1L);

        int databaseSizeBeforeCreate = teatroRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeatroMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teatro)))
            .andExpect(status().isBadRequest());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTeatros() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        // Get all the teatroList
        restTeatroMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teatro.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTeatro").value(hasItem(DEFAULT_ID_TEATRO)))
            .andExpect(jsonPath("$.[*].nomeTeatro").value(hasItem(DEFAULT_NOME_TEATRO)))
            .andExpect(jsonPath("$.[*].endereco").value(hasItem(DEFAULT_ENDERECO)));
    }

    @Test
    @Transactional
    void getTeatro() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        // Get the teatro
        restTeatroMockMvc
            .perform(get(ENTITY_API_URL_ID, teatro.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teatro.getId().intValue()))
            .andExpect(jsonPath("$.idTeatro").value(DEFAULT_ID_TEATRO))
            .andExpect(jsonPath("$.nomeTeatro").value(DEFAULT_NOME_TEATRO))
            .andExpect(jsonPath("$.endereco").value(DEFAULT_ENDERECO));
    }

    @Test
    @Transactional
    void getNonExistingTeatro() throws Exception {
        // Get the teatro
        restTeatroMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTeatro() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();

        // Update the teatro
        Teatro updatedTeatro = teatroRepository.findById(teatro.getId()).get();
        // Disconnect from session so that the updates on updatedTeatro are not directly saved in db
        em.detach(updatedTeatro);
        updatedTeatro.idTeatro(UPDATED_ID_TEATRO).nomeTeatro(UPDATED_NOME_TEATRO).endereco(UPDATED_ENDERECO);

        restTeatroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTeatro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTeatro))
            )
            .andExpect(status().isOk());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
        Teatro testTeatro = teatroList.get(teatroList.size() - 1);
        assertThat(testTeatro.getIdTeatro()).isEqualTo(UPDATED_ID_TEATRO);
        assertThat(testTeatro.getNomeTeatro()).isEqualTo(UPDATED_NOME_TEATRO);
        assertThat(testTeatro.getEndereco()).isEqualTo(UPDATED_ENDERECO);
    }

    @Test
    @Transactional
    void putNonExistingTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teatro.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teatro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teatro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teatro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeatroWithPatch() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();

        // Update the teatro using partial update
        Teatro partialUpdatedTeatro = new Teatro();
        partialUpdatedTeatro.setId(teatro.getId());

        restTeatroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeatro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeatro))
            )
            .andExpect(status().isOk());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
        Teatro testTeatro = teatroList.get(teatroList.size() - 1);
        assertThat(testTeatro.getIdTeatro()).isEqualTo(DEFAULT_ID_TEATRO);
        assertThat(testTeatro.getNomeTeatro()).isEqualTo(DEFAULT_NOME_TEATRO);
        assertThat(testTeatro.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
    }

    @Test
    @Transactional
    void fullUpdateTeatroWithPatch() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();

        // Update the teatro using partial update
        Teatro partialUpdatedTeatro = new Teatro();
        partialUpdatedTeatro.setId(teatro.getId());

        partialUpdatedTeatro.idTeatro(UPDATED_ID_TEATRO).nomeTeatro(UPDATED_NOME_TEATRO).endereco(UPDATED_ENDERECO);

        restTeatroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeatro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeatro))
            )
            .andExpect(status().isOk());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
        Teatro testTeatro = teatroList.get(teatroList.size() - 1);
        assertThat(testTeatro.getIdTeatro()).isEqualTo(UPDATED_ID_TEATRO);
        assertThat(testTeatro.getNomeTeatro()).isEqualTo(UPDATED_NOME_TEATRO);
        assertThat(testTeatro.getEndereco()).isEqualTo(UPDATED_ENDERECO);
    }

    @Test
    @Transactional
    void patchNonExistingTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teatro.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teatro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teatro))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeatro() throws Exception {
        int databaseSizeBeforeUpdate = teatroRepository.findAll().size();
        teatro.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeatroMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(teatro)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teatro in the database
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeatro() throws Exception {
        // Initialize the database
        teatroRepository.saveAndFlush(teatro);

        int databaseSizeBeforeDelete = teatroRepository.findAll().size();

        // Delete the teatro
        restTeatroMockMvc
            .perform(delete(ENTITY_API_URL_ID, teatro.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Teatro> teatroList = teatroRepository.findAll();
        assertThat(teatroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
