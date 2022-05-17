package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.LigneOrdonnances;
import com.mycompany.myapp.repository.LigneOrdonnancesRepository;
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
 * Integration tests for the {@link LigneOrdonnancesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LigneOrdonnancesResourceIT {

    private static final String DEFAULT_MEDICAMENT = "AAAAAAAAAA";
    private static final String UPDATED_MEDICAMENT = "BBBBBBBBBB";

    private static final String DEFAULT_POSOLOGIE = "AAAAAAAAAA";
    private static final String UPDATED_POSOLOGIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ligne-ordonnances";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LigneOrdonnancesRepository ligneOrdonnancesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLigneOrdonnancesMockMvc;

    private LigneOrdonnances ligneOrdonnances;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LigneOrdonnances createEntity(EntityManager em) {
        LigneOrdonnances ligneOrdonnances = new LigneOrdonnances().medicament(DEFAULT_MEDICAMENT).posologie(DEFAULT_POSOLOGIE);
        return ligneOrdonnances;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LigneOrdonnances createUpdatedEntity(EntityManager em) {
        LigneOrdonnances ligneOrdonnances = new LigneOrdonnances().medicament(UPDATED_MEDICAMENT).posologie(UPDATED_POSOLOGIE);
        return ligneOrdonnances;
    }

    @BeforeEach
    public void initTest() {
        ligneOrdonnances = createEntity(em);
    }

    @Test
    @Transactional
    void createLigneOrdonnances() throws Exception {
        int databaseSizeBeforeCreate = ligneOrdonnancesRepository.findAll().size();
        // Create the LigneOrdonnances
        restLigneOrdonnancesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isCreated());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeCreate + 1);
        LigneOrdonnances testLigneOrdonnances = ligneOrdonnancesList.get(ligneOrdonnancesList.size() - 1);
        assertThat(testLigneOrdonnances.getMedicament()).isEqualTo(DEFAULT_MEDICAMENT);
        assertThat(testLigneOrdonnances.getPosologie()).isEqualTo(DEFAULT_POSOLOGIE);
    }

    @Test
    @Transactional
    void createLigneOrdonnancesWithExistingId() throws Exception {
        // Create the LigneOrdonnances with an existing ID
        ligneOrdonnances.setId(1L);

        int databaseSizeBeforeCreate = ligneOrdonnancesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLigneOrdonnancesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLigneOrdonnances() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        // Get all the ligneOrdonnancesList
        restLigneOrdonnancesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ligneOrdonnances.getId().intValue())))
            .andExpect(jsonPath("$.[*].medicament").value(hasItem(DEFAULT_MEDICAMENT)))
            .andExpect(jsonPath("$.[*].posologie").value(hasItem(DEFAULT_POSOLOGIE)));
    }

    @Test
    @Transactional
    void getLigneOrdonnances() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        // Get the ligneOrdonnances
        restLigneOrdonnancesMockMvc
            .perform(get(ENTITY_API_URL_ID, ligneOrdonnances.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ligneOrdonnances.getId().intValue()))
            .andExpect(jsonPath("$.medicament").value(DEFAULT_MEDICAMENT))
            .andExpect(jsonPath("$.posologie").value(DEFAULT_POSOLOGIE));
    }

    @Test
    @Transactional
    void getNonExistingLigneOrdonnances() throws Exception {
        // Get the ligneOrdonnances
        restLigneOrdonnancesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLigneOrdonnances() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();

        // Update the ligneOrdonnances
        LigneOrdonnances updatedLigneOrdonnances = ligneOrdonnancesRepository.findById(ligneOrdonnances.getId()).get();
        // Disconnect from session so that the updates on updatedLigneOrdonnances are not directly saved in db
        em.detach(updatedLigneOrdonnances);
        updatedLigneOrdonnances.medicament(UPDATED_MEDICAMENT).posologie(UPDATED_POSOLOGIE);

        restLigneOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLigneOrdonnances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLigneOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
        LigneOrdonnances testLigneOrdonnances = ligneOrdonnancesList.get(ligneOrdonnancesList.size() - 1);
        assertThat(testLigneOrdonnances.getMedicament()).isEqualTo(UPDATED_MEDICAMENT);
        assertThat(testLigneOrdonnances.getPosologie()).isEqualTo(UPDATED_POSOLOGIE);
    }

    @Test
    @Transactional
    void putNonExistingLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ligneOrdonnances.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLigneOrdonnancesWithPatch() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();

        // Update the ligneOrdonnances using partial update
        LigneOrdonnances partialUpdatedLigneOrdonnances = new LigneOrdonnances();
        partialUpdatedLigneOrdonnances.setId(ligneOrdonnances.getId());

        restLigneOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLigneOrdonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLigneOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
        LigneOrdonnances testLigneOrdonnances = ligneOrdonnancesList.get(ligneOrdonnancesList.size() - 1);
        assertThat(testLigneOrdonnances.getMedicament()).isEqualTo(DEFAULT_MEDICAMENT);
        assertThat(testLigneOrdonnances.getPosologie()).isEqualTo(DEFAULT_POSOLOGIE);
    }

    @Test
    @Transactional
    void fullUpdateLigneOrdonnancesWithPatch() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();

        // Update the ligneOrdonnances using partial update
        LigneOrdonnances partialUpdatedLigneOrdonnances = new LigneOrdonnances();
        partialUpdatedLigneOrdonnances.setId(ligneOrdonnances.getId());

        partialUpdatedLigneOrdonnances.medicament(UPDATED_MEDICAMENT).posologie(UPDATED_POSOLOGIE);

        restLigneOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLigneOrdonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLigneOrdonnances))
            )
            .andExpect(status().isOk());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
        LigneOrdonnances testLigneOrdonnances = ligneOrdonnancesList.get(ligneOrdonnancesList.size() - 1);
        assertThat(testLigneOrdonnances.getMedicament()).isEqualTo(UPDATED_MEDICAMENT);
        assertThat(testLigneOrdonnances.getPosologie()).isEqualTo(UPDATED_POSOLOGIE);
    }

    @Test
    @Transactional
    void patchNonExistingLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ligneOrdonnances.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLigneOrdonnances() throws Exception {
        int databaseSizeBeforeUpdate = ligneOrdonnancesRepository.findAll().size();
        ligneOrdonnances.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneOrdonnancesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ligneOrdonnances))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LigneOrdonnances in the database
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLigneOrdonnances() throws Exception {
        // Initialize the database
        ligneOrdonnancesRepository.saveAndFlush(ligneOrdonnances);

        int databaseSizeBeforeDelete = ligneOrdonnancesRepository.findAll().size();

        // Delete the ligneOrdonnances
        restLigneOrdonnancesMockMvc
            .perform(delete(ENTITY_API_URL_ID, ligneOrdonnances.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LigneOrdonnances> ligneOrdonnancesList = ligneOrdonnancesRepository.findAll();
        assertThat(ligneOrdonnancesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
