package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CategorieChambres;
import com.mycompany.myapp.repository.CategorieChambresRepository;
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
 * Integration tests for the {@link CategorieChambresResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CategorieChambresResourceIT {

    private static final String DEFAULT_LIBELLE_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE_CATEGORY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_CHAMBRE = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_CHAMBRE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/categorie-chambres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CategorieChambresRepository categorieChambresRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCategorieChambresMockMvc;

    private CategorieChambres categorieChambres;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategorieChambres createEntity(EntityManager em) {
        CategorieChambres categorieChambres = new CategorieChambres()
            .libelleCategory(DEFAULT_LIBELLE_CATEGORY)
            .descriptionChambre(DEFAULT_DESCRIPTION_CHAMBRE);
        return categorieChambres;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategorieChambres createUpdatedEntity(EntityManager em) {
        CategorieChambres categorieChambres = new CategorieChambres()
            .libelleCategory(UPDATED_LIBELLE_CATEGORY)
            .descriptionChambre(UPDATED_DESCRIPTION_CHAMBRE);
        return categorieChambres;
    }

    @BeforeEach
    public void initTest() {
        categorieChambres = createEntity(em);
    }

    @Test
    @Transactional
    void createCategorieChambres() throws Exception {
        int databaseSizeBeforeCreate = categorieChambresRepository.findAll().size();
        // Create the CategorieChambres
        restCategorieChambresMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isCreated());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeCreate + 1);
        CategorieChambres testCategorieChambres = categorieChambresList.get(categorieChambresList.size() - 1);
        assertThat(testCategorieChambres.getLibelleCategory()).isEqualTo(DEFAULT_LIBELLE_CATEGORY);
        assertThat(testCategorieChambres.getDescriptionChambre()).isEqualTo(DEFAULT_DESCRIPTION_CHAMBRE);
    }

    @Test
    @Transactional
    void createCategorieChambresWithExistingId() throws Exception {
        // Create the CategorieChambres with an existing ID
        categorieChambres.setId(1L);

        int databaseSizeBeforeCreate = categorieChambresRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategorieChambresMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCategorieChambres() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        // Get all the categorieChambresList
        restCategorieChambresMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categorieChambres.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelleCategory").value(hasItem(DEFAULT_LIBELLE_CATEGORY)))
            .andExpect(jsonPath("$.[*].descriptionChambre").value(hasItem(DEFAULT_DESCRIPTION_CHAMBRE)));
    }

    @Test
    @Transactional
    void getCategorieChambres() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        // Get the categorieChambres
        restCategorieChambresMockMvc
            .perform(get(ENTITY_API_URL_ID, categorieChambres.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(categorieChambres.getId().intValue()))
            .andExpect(jsonPath("$.libelleCategory").value(DEFAULT_LIBELLE_CATEGORY))
            .andExpect(jsonPath("$.descriptionChambre").value(DEFAULT_DESCRIPTION_CHAMBRE));
    }

    @Test
    @Transactional
    void getNonExistingCategorieChambres() throws Exception {
        // Get the categorieChambres
        restCategorieChambresMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCategorieChambres() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();

        // Update the categorieChambres
        CategorieChambres updatedCategorieChambres = categorieChambresRepository.findById(categorieChambres.getId()).get();
        // Disconnect from session so that the updates on updatedCategorieChambres are not directly saved in db
        em.detach(updatedCategorieChambres);
        updatedCategorieChambres.libelleCategory(UPDATED_LIBELLE_CATEGORY).descriptionChambre(UPDATED_DESCRIPTION_CHAMBRE);

        restCategorieChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCategorieChambres.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCategorieChambres))
            )
            .andExpect(status().isOk());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
        CategorieChambres testCategorieChambres = categorieChambresList.get(categorieChambresList.size() - 1);
        assertThat(testCategorieChambres.getLibelleCategory()).isEqualTo(UPDATED_LIBELLE_CATEGORY);
        assertThat(testCategorieChambres.getDescriptionChambre()).isEqualTo(UPDATED_DESCRIPTION_CHAMBRE);
    }

    @Test
    @Transactional
    void putNonExistingCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, categorieChambres.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCategorieChambresWithPatch() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();

        // Update the categorieChambres using partial update
        CategorieChambres partialUpdatedCategorieChambres = new CategorieChambres();
        partialUpdatedCategorieChambres.setId(categorieChambres.getId());

        restCategorieChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCategorieChambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCategorieChambres))
            )
            .andExpect(status().isOk());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
        CategorieChambres testCategorieChambres = categorieChambresList.get(categorieChambresList.size() - 1);
        assertThat(testCategorieChambres.getLibelleCategory()).isEqualTo(DEFAULT_LIBELLE_CATEGORY);
        assertThat(testCategorieChambres.getDescriptionChambre()).isEqualTo(DEFAULT_DESCRIPTION_CHAMBRE);
    }

    @Test
    @Transactional
    void fullUpdateCategorieChambresWithPatch() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();

        // Update the categorieChambres using partial update
        CategorieChambres partialUpdatedCategorieChambres = new CategorieChambres();
        partialUpdatedCategorieChambres.setId(categorieChambres.getId());

        partialUpdatedCategorieChambres.libelleCategory(UPDATED_LIBELLE_CATEGORY).descriptionChambre(UPDATED_DESCRIPTION_CHAMBRE);

        restCategorieChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCategorieChambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCategorieChambres))
            )
            .andExpect(status().isOk());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
        CategorieChambres testCategorieChambres = categorieChambresList.get(categorieChambresList.size() - 1);
        assertThat(testCategorieChambres.getLibelleCategory()).isEqualTo(UPDATED_LIBELLE_CATEGORY);
        assertThat(testCategorieChambres.getDescriptionChambre()).isEqualTo(UPDATED_DESCRIPTION_CHAMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, categorieChambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCategorieChambres() throws Exception {
        int databaseSizeBeforeUpdate = categorieChambresRepository.findAll().size();
        categorieChambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCategorieChambresMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(categorieChambres))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CategorieChambres in the database
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCategorieChambres() throws Exception {
        // Initialize the database
        categorieChambresRepository.saveAndFlush(categorieChambres);

        int databaseSizeBeforeDelete = categorieChambresRepository.findAll().size();

        // Delete the categorieChambres
        restCategorieChambresMockMvc
            .perform(delete(ENTITY_API_URL_ID, categorieChambres.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CategorieChambres> categorieChambresList = categorieChambresRepository.findAll();
        assertThat(categorieChambresList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
