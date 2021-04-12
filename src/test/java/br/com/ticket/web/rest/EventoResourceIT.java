package br.com.ticket.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.ticket.IntegrationTest;
import br.com.ticket.domain.Evento;
import br.com.ticket.repository.EventoRepository;
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
 * Integration tests for the {@link EventoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EventoResourceIT {

    private static final String DEFAULT_ID_EVENTO = "AAAAAAAAAA";
    private static final String UPDATED_ID_EVENTO = "BBBBBBBBBB";

    private static final String DEFAULT_NOME_EVENTO = "AAAAAAAAAA";
    private static final String UPDATED_NOME_EVENTO = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/eventos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEventoMockMvc;

    private Evento evento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evento createEntity(EntityManager em) {
        Evento evento = new Evento().idEvento(DEFAULT_ID_EVENTO).nomeEvento(DEFAULT_NOME_EVENTO).descricao(DEFAULT_DESCRICAO);
        return evento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Evento createUpdatedEntity(EntityManager em) {
        Evento evento = new Evento().idEvento(UPDATED_ID_EVENTO).nomeEvento(UPDATED_NOME_EVENTO).descricao(UPDATED_DESCRICAO);
        return evento;
    }

    @BeforeEach
    public void initTest() {
        evento = createEntity(em);
    }

    @Test
    @Transactional
    void createEvento() throws Exception {
        int databaseSizeBeforeCreate = eventoRepository.findAll().size();
        // Create the Evento
        restEventoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evento)))
            .andExpect(status().isCreated());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeCreate + 1);
        Evento testEvento = eventoList.get(eventoList.size() - 1);
        assertThat(testEvento.getIdEvento()).isEqualTo(DEFAULT_ID_EVENTO);
        assertThat(testEvento.getNomeEvento()).isEqualTo(DEFAULT_NOME_EVENTO);
        assertThat(testEvento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
    }

    @Test
    @Transactional
    void createEventoWithExistingId() throws Exception {
        // Create the Evento with an existing ID
        evento.setId(1L);

        int databaseSizeBeforeCreate = eventoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evento)))
            .andExpect(status().isBadRequest());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEventos() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        // Get all the eventoList
        restEventoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(evento.getId().intValue())))
            .andExpect(jsonPath("$.[*].idEvento").value(hasItem(DEFAULT_ID_EVENTO)))
            .andExpect(jsonPath("$.[*].nomeEvento").value(hasItem(DEFAULT_NOME_EVENTO)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @Test
    @Transactional
    void getEvento() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        // Get the evento
        restEventoMockMvc
            .perform(get(ENTITY_API_URL_ID, evento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(evento.getId().intValue()))
            .andExpect(jsonPath("$.idEvento").value(DEFAULT_ID_EVENTO))
            .andExpect(jsonPath("$.nomeEvento").value(DEFAULT_NOME_EVENTO))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingEvento() throws Exception {
        // Get the evento
        restEventoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEvento() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();

        // Update the evento
        Evento updatedEvento = eventoRepository.findById(evento.getId()).get();
        // Disconnect from session so that the updates on updatedEvento are not directly saved in db
        em.detach(updatedEvento);
        updatedEvento.idEvento(UPDATED_ID_EVENTO).nomeEvento(UPDATED_NOME_EVENTO).descricao(UPDATED_DESCRICAO);

        restEventoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEvento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEvento))
            )
            .andExpect(status().isOk());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
        Evento testEvento = eventoList.get(eventoList.size() - 1);
        assertThat(testEvento.getIdEvento()).isEqualTo(UPDATED_ID_EVENTO);
        assertThat(testEvento.getNomeEvento()).isEqualTo(UPDATED_NOME_EVENTO);
        assertThat(testEvento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void putNonExistingEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, evento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(evento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(evento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(evento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEventoWithPatch() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();

        // Update the evento using partial update
        Evento partialUpdatedEvento = new Evento();
        partialUpdatedEvento.setId(evento.getId());

        partialUpdatedEvento.idEvento(UPDATED_ID_EVENTO).nomeEvento(UPDATED_NOME_EVENTO);

        restEventoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvento))
            )
            .andExpect(status().isOk());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
        Evento testEvento = eventoList.get(eventoList.size() - 1);
        assertThat(testEvento.getIdEvento()).isEqualTo(UPDATED_ID_EVENTO);
        assertThat(testEvento.getNomeEvento()).isEqualTo(UPDATED_NOME_EVENTO);
        assertThat(testEvento.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
    }

    @Test
    @Transactional
    void fullUpdateEventoWithPatch() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();

        // Update the evento using partial update
        Evento partialUpdatedEvento = new Evento();
        partialUpdatedEvento.setId(evento.getId());

        partialUpdatedEvento.idEvento(UPDATED_ID_EVENTO).nomeEvento(UPDATED_NOME_EVENTO).descricao(UPDATED_DESCRICAO);

        restEventoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEvento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEvento))
            )
            .andExpect(status().isOk());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
        Evento testEvento = eventoList.get(eventoList.size() - 1);
        assertThat(testEvento.getIdEvento()).isEqualTo(UPDATED_ID_EVENTO);
        assertThat(testEvento.getNomeEvento()).isEqualTo(UPDATED_NOME_EVENTO);
        assertThat(testEvento.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void patchNonExistingEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, evento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(evento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(evento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEvento() throws Exception {
        int databaseSizeBeforeUpdate = eventoRepository.findAll().size();
        evento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEventoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(evento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Evento in the database
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEvento() throws Exception {
        // Initialize the database
        eventoRepository.saveAndFlush(evento);

        int databaseSizeBeforeDelete = eventoRepository.findAll().size();

        // Delete the evento
        restEventoMockMvc
            .perform(delete(ENTITY_API_URL_ID, evento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Evento> eventoList = eventoRepository.findAll();
        assertThat(eventoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
