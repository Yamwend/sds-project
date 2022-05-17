package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Ordonnances;
import com.mycompany.myapp.repository.OrdonnancesRepository;
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
 * Integration tests for the {@link OrdonnancesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrdonnancesResourceIT {

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ordonnances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrdonnancesRepository ordonnancesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrdonnancesMockMvc;

    private Ordonnances ordonnances;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnances createEntity(EntityManager em) {
        Ordonnances ordonnances = new Ordonnances().numero(DEFAULT_NUMERO);
        return ordonnances;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ordonnances createUpdatedEntity(EntityManager em) {
        Ordonnances ordonnances = new Ordonnances().numero(UPDATED_NUMERO);
        return ordonnances;
    }

    @BeforeEach
    public void initTest() {
        ordonnances = createEntity(em);
    }

    @Test
    @Transactional
    void createOrdonnances() throws Exception {
        int databaseSizeBeforeCreate = ordonnancesRepository.findAll().size();
        // Create the Ordonnances
        restOrdonnancesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnances)))
            .andExpect(status().isCreated());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeCreate + 1);
        Ordonnances testOrdonnances = ordonnancesList.get(ordonnancesList.size() - 1);
        assertThat(testOrdonnances.getNumero()).isEqualTo(DEFAULT_NUMERO);
    }

    @Test
    @Transactional
    void createOrdonnancesWithExistingId() throws Exception {
        // Create the Ordonnances with an existing ID
        ordonnances.setId(1L);

        int databaseSizeBeforeCreate = ordonnancesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrdonnancesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnances)))
            .andExpect(status().isBadRequest());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrdonnances() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        // Get all the ordonnancesList
        restOrdonnancesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ordonnances.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)));
    }

    @Test
    @Transactional
    void getOrdonnances() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        // Get the ordonnances
        restOrdonnancesMockMvc
            .perform(get(ENTITY_API_URL_ID, ordonnances.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ordonnances.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO));
    }

    @Test
    @Transactional
    void getNonExistingOrdonnances() throws Exception {
        // Get the ordonnances
        restOrdonnancesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrdonnances() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();

        // Update the ordonnances
        Ordonnances updatedOrdonnances = ordonnancesRepository.findById(ordonnances.getId()).get();
        // Disconnect from session so that the updates on updatedOrdonnances are not directly saved in db
        em.detach(updatedOrdonnances);
        updatedOrdonnances.numero(UPDATED_NUMERO);

        restOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrdonnances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
        Ordonnances testOrdonnances = ordonnancesList.get(ordonnancesList.size() - 1);
        assertThat(testOrdonnances.getNumero()).isEqualTo(UPDATED_NUMERO);
    }

    @Test
    @Transactional
    void putNonExistingOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ordonnances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ordonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ordonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ordonnances)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrdonnancesWithPatch() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();

        // Update the ordonnances using partial update
        Ordonnances partialUpdatedOrdonnances = new Ordonnances();
        partialUpdatedOrdonnances.setId(ordonnances.getId());

        restOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrdonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
        Ordonnances testOrdonnances = ordonnancesList.get(ordonnancesList.size() - 1);
        assertThat(testOrdonnances.getNumero()).isEqualTo(DEFAULT_NUMERO);
    }

    @Test
    @Transactional
    void fullUpdateOrdonnancesWithPatch() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();

        // Update the ordonnances using partial update
        Ordonnances partialUpdatedOrdonnances = new Ordonnances();
        partialUpdatedOrdonnances.setId(ordonnances.getId());

        partialUpdatedOrdonnances.numero(UPDATED_NUMERO);

        restOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrdonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
        Ordonnances testOrdonnances = ordonnancesList.get(ordonnancesList.size() - 1);
        assertThat(testOrdonnances.getNumero()).isEqualTo(UPDATED_NUMERO);
    }

    @Test
    @Transactional
    void patchNonExistingOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ordonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ordonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ordonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ordonnancesRepository.findAll().size();
        ordonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ordonnances))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ordonnances in the database
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrdonnances() throws Exception {
        // Initialize the database
        ordonnancesRepository.saveAndFlush(ordonnances);

        int databaseSizeBeforeDelete = ordonnancesRepository.findAll().size();

        // Delete the ordonnances
        restOrdonnancesMockMvc
            .perform(delete(ENTITY_API_URL_ID, ordonnances.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ordonnances> ordonnancesList = ordonnancesRepository.findAll();
        assertThat(ordonnancesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
