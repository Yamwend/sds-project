package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.FamilleMaladies;
import com.mycompany.myapp.repository.FamilleMaladiesRepository;
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
 * Integration tests for the {@link FamilleMaladiesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FamilleMaladiesResourceIT {

    private static final String DEFAULT_LIBELLE_F_MALADIE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE_F_MALADIE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_F_MALADIE = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_F_MALADIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/famille-maladies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FamilleMaladiesRepository familleMaladiesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFamilleMaladiesMockMvc;

    private FamilleMaladies familleMaladies;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FamilleMaladies createEntity(EntityManager em) {
        FamilleMaladies familleMaladies = new FamilleMaladies()
            .libelleFMaladie(DEFAULT_LIBELLE_F_MALADIE)
            .descriptionFMaladie(DEFAULT_DESCRIPTION_F_MALADIE);
        return familleMaladies;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FamilleMaladies createUpdatedEntity(EntityManager em) {
        FamilleMaladies familleMaladies = new FamilleMaladies()
            .libelleFMaladie(UPDATED_LIBELLE_F_MALADIE)
            .descriptionFMaladie(UPDATED_DESCRIPTION_F_MALADIE);
        return familleMaladies;
    }

    @BeforeEach
    public void initTest() {
        familleMaladies = createEntity(em);
    }

    @Test
    @Transactional
    void createFamilleMaladies() throws Exception {
        int databaseSizeBeforeCreate = familleMaladiesRepository.findAll().size();
        // Create the FamilleMaladies
        restFamilleMaladiesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isCreated());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeCreate + 1);
        FamilleMaladies testFamilleMaladies = familleMaladiesList.get(familleMaladiesList.size() - 1);
        assertThat(testFamilleMaladies.getLibelleFMaladie()).isEqualTo(DEFAULT_LIBELLE_F_MALADIE);
        assertThat(testFamilleMaladies.getDescriptionFMaladie()).isEqualTo(DEFAULT_DESCRIPTION_F_MALADIE);
    }

    @Test
    @Transactional
    void createFamilleMaladiesWithExistingId() throws Exception {
        // Create the FamilleMaladies with an existing ID
        familleMaladies.setId(1L);

        int databaseSizeBeforeCreate = familleMaladiesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFamilleMaladiesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFamilleMaladies() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        // Get all the familleMaladiesList
        restFamilleMaladiesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(familleMaladies.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelleFMaladie").value(hasItem(DEFAULT_LIBELLE_F_MALADIE)))
            .andExpect(jsonPath("$.[*].descriptionFMaladie").value(hasItem(DEFAULT_DESCRIPTION_F_MALADIE)));
    }

    @Test
    @Transactional
    void getFamilleMaladies() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        // Get the familleMaladies
        restFamilleMaladiesMockMvc
            .perform(get(ENTITY_API_URL_ID, familleMaladies.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(familleMaladies.getId().intValue()))
            .andExpect(jsonPath("$.libelleFMaladie").value(DEFAULT_LIBELLE_F_MALADIE))
            .andExpect(jsonPath("$.descriptionFMaladie").value(DEFAULT_DESCRIPTION_F_MALADIE));
    }

    @Test
    @Transactional
    void getNonExistingFamilleMaladies() throws Exception {
        // Get the familleMaladies
        restFamilleMaladiesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFamilleMaladies() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();

        // Update the familleMaladies
        FamilleMaladies updatedFamilleMaladies = familleMaladiesRepository.findById(familleMaladies.getId()).get();
        // Disconnect from session so that the updates on updatedFamilleMaladies are not directly saved in db
        em.detach(updatedFamilleMaladies);
        updatedFamilleMaladies.libelleFMaladie(UPDATED_LIBELLE_F_MALADIE).descriptionFMaladie(UPDATED_DESCRIPTION_F_MALADIE);

        restFamilleMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFamilleMaladies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFamilleMaladies))
            )
            .andExpect(status().isOk());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
        FamilleMaladies testFamilleMaladies = familleMaladiesList.get(familleMaladiesList.size() - 1);
        assertThat(testFamilleMaladies.getLibelleFMaladie()).isEqualTo(UPDATED_LIBELLE_F_MALADIE);
        assertThat(testFamilleMaladies.getDescriptionFMaladie()).isEqualTo(UPDATED_DESCRIPTION_F_MALADIE);
    }

    @Test
    @Transactional
    void putNonExistingFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, familleMaladies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFamilleMaladiesWithPatch() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();

        // Update the familleMaladies using partial update
        FamilleMaladies partialUpdatedFamilleMaladies = new FamilleMaladies();
        partialUpdatedFamilleMaladies.setId(familleMaladies.getId());

        partialUpdatedFamilleMaladies.libelleFMaladie(UPDATED_LIBELLE_F_MALADIE);

        restFamilleMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFamilleMaladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFamilleMaladies))
            )
            .andExpect(status().isOk());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
        FamilleMaladies testFamilleMaladies = familleMaladiesList.get(familleMaladiesList.size() - 1);
        assertThat(testFamilleMaladies.getLibelleFMaladie()).isEqualTo(UPDATED_LIBELLE_F_MALADIE);
        assertThat(testFamilleMaladies.getDescriptionFMaladie()).isEqualTo(DEFAULT_DESCRIPTION_F_MALADIE);
    }

    @Test
    @Transactional
    void fullUpdateFamilleMaladiesWithPatch() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();

        // Update the familleMaladies using partial update
        FamilleMaladies partialUpdatedFamilleMaladies = new FamilleMaladies();
        partialUpdatedFamilleMaladies.setId(familleMaladies.getId());

        partialUpdatedFamilleMaladies.libelleFMaladie(UPDATED_LIBELLE_F_MALADIE).descriptionFMaladie(UPDATED_DESCRIPTION_F_MALADIE);

        restFamilleMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFamilleMaladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFamilleMaladies))
            )
            .andExpect(status().isOk());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
        FamilleMaladies testFamilleMaladies = familleMaladiesList.get(familleMaladiesList.size() - 1);
        assertThat(testFamilleMaladies.getLibelleFMaladie()).isEqualTo(UPDATED_LIBELLE_F_MALADIE);
        assertThat(testFamilleMaladies.getDescriptionFMaladie()).isEqualTo(UPDATED_DESCRIPTION_F_MALADIE);
    }

    @Test
    @Transactional
    void patchNonExistingFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, familleMaladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFamilleMaladies() throws Exception {
        int databaseSizeBeforeUpdate = familleMaladiesRepository.findAll().size();
        familleMaladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFamilleMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(familleMaladies))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FamilleMaladies in the database
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFamilleMaladies() throws Exception {
        // Initialize the database
        familleMaladiesRepository.saveAndFlush(familleMaladies);

        int databaseSizeBeforeDelete = familleMaladiesRepository.findAll().size();

        // Delete the familleMaladies
        restFamilleMaladiesMockMvc
            .perform(delete(ENTITY_API_URL_ID, familleMaladies.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FamilleMaladies> familleMaladiesList = familleMaladiesRepository.findAll();
        assertThat(familleMaladiesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
