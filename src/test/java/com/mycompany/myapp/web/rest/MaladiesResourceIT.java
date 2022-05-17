package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Maladies;
import com.mycompany.myapp.repository.MaladiesRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MaladiesResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MaladiesResourceIT {

    private static final String DEFAULT_NOM_MALADIE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_MALADIE = "BBBBBBBBBB";

    private static final String DEFAULT_FAMILLE_MALADIE = "AAAAAAAAAA";
    private static final String UPDATED_FAMILLE_MALADIE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION_MALADIE = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION_MALADIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/maladies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MaladiesRepository maladiesRepository;

    @Mock
    private MaladiesRepository maladiesRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMaladiesMockMvc;

    private Maladies maladies;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maladies createEntity(EntityManager em) {
        Maladies maladies = new Maladies()
            .nomMaladie(DEFAULT_NOM_MALADIE)
            .familleMaladie(DEFAULT_FAMILLE_MALADIE)
            .descriptionMaladie(DEFAULT_DESCRIPTION_MALADIE);
        return maladies;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Maladies createUpdatedEntity(EntityManager em) {
        Maladies maladies = new Maladies()
            .nomMaladie(UPDATED_NOM_MALADIE)
            .familleMaladie(UPDATED_FAMILLE_MALADIE)
            .descriptionMaladie(UPDATED_DESCRIPTION_MALADIE);
        return maladies;
    }

    @BeforeEach
    public void initTest() {
        maladies = createEntity(em);
    }

    @Test
    @Transactional
    void createMaladies() throws Exception {
        int databaseSizeBeforeCreate = maladiesRepository.findAll().size();
        // Create the Maladies
        restMaladiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladies)))
            .andExpect(status().isCreated());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeCreate + 1);
        Maladies testMaladies = maladiesList.get(maladiesList.size() - 1);
        assertThat(testMaladies.getNomMaladie()).isEqualTo(DEFAULT_NOM_MALADIE);
        assertThat(testMaladies.getFamilleMaladie()).isEqualTo(DEFAULT_FAMILLE_MALADIE);
        assertThat(testMaladies.getDescriptionMaladie()).isEqualTo(DEFAULT_DESCRIPTION_MALADIE);
    }

    @Test
    @Transactional
    void createMaladiesWithExistingId() throws Exception {
        // Create the Maladies with an existing ID
        maladies.setId(1L);

        int databaseSizeBeforeCreate = maladiesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMaladiesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladies)))
            .andExpect(status().isBadRequest());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMaladies() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        // Get all the maladiesList
        restMaladiesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(maladies.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomMaladie").value(hasItem(DEFAULT_NOM_MALADIE)))
            .andExpect(jsonPath("$.[*].familleMaladie").value(hasItem(DEFAULT_FAMILLE_MALADIE)))
            .andExpect(jsonPath("$.[*].descriptionMaladie").value(hasItem(DEFAULT_DESCRIPTION_MALADIE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMaladiesWithEagerRelationshipsIsEnabled() throws Exception {
        when(maladiesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMaladiesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(maladiesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMaladiesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(maladiesRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMaladiesMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(maladiesRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getMaladies() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        // Get the maladies
        restMaladiesMockMvc
            .perform(get(ENTITY_API_URL_ID, maladies.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(maladies.getId().intValue()))
            .andExpect(jsonPath("$.nomMaladie").value(DEFAULT_NOM_MALADIE))
            .andExpect(jsonPath("$.familleMaladie").value(DEFAULT_FAMILLE_MALADIE))
            .andExpect(jsonPath("$.descriptionMaladie").value(DEFAULT_DESCRIPTION_MALADIE));
    }

    @Test
    @Transactional
    void getNonExistingMaladies() throws Exception {
        // Get the maladies
        restMaladiesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMaladies() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();

        // Update the maladies
        Maladies updatedMaladies = maladiesRepository.findById(maladies.getId()).get();
        // Disconnect from session so that the updates on updatedMaladies are not directly saved in db
        em.detach(updatedMaladies);
        updatedMaladies
            .nomMaladie(UPDATED_NOM_MALADIE)
            .familleMaladie(UPDATED_FAMILLE_MALADIE)
            .descriptionMaladie(UPDATED_DESCRIPTION_MALADIE);

        restMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMaladies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMaladies))
            )
            .andExpect(status().isOk());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
        Maladies testMaladies = maladiesList.get(maladiesList.size() - 1);
        assertThat(testMaladies.getNomMaladie()).isEqualTo(UPDATED_NOM_MALADIE);
        assertThat(testMaladies.getFamilleMaladie()).isEqualTo(UPDATED_FAMILLE_MALADIE);
        assertThat(testMaladies.getDescriptionMaladie()).isEqualTo(UPDATED_DESCRIPTION_MALADIE);
    }

    @Test
    @Transactional
    void putNonExistingMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, maladies.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(maladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(maladies)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMaladiesWithPatch() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();

        // Update the maladies using partial update
        Maladies partialUpdatedMaladies = new Maladies();
        partialUpdatedMaladies.setId(maladies.getId());

        partialUpdatedMaladies
            .nomMaladie(UPDATED_NOM_MALADIE)
            .familleMaladie(UPDATED_FAMILLE_MALADIE)
            .descriptionMaladie(UPDATED_DESCRIPTION_MALADIE);

        restMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaladies))
            )
            .andExpect(status().isOk());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
        Maladies testMaladies = maladiesList.get(maladiesList.size() - 1);
        assertThat(testMaladies.getNomMaladie()).isEqualTo(UPDATED_NOM_MALADIE);
        assertThat(testMaladies.getFamilleMaladie()).isEqualTo(UPDATED_FAMILLE_MALADIE);
        assertThat(testMaladies.getDescriptionMaladie()).isEqualTo(UPDATED_DESCRIPTION_MALADIE);
    }

    @Test
    @Transactional
    void fullUpdateMaladiesWithPatch() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();

        // Update the maladies using partial update
        Maladies partialUpdatedMaladies = new Maladies();
        partialUpdatedMaladies.setId(maladies.getId());

        partialUpdatedMaladies
            .nomMaladie(UPDATED_NOM_MALADIE)
            .familleMaladie(UPDATED_FAMILLE_MALADIE)
            .descriptionMaladie(UPDATED_DESCRIPTION_MALADIE);

        restMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMaladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMaladies))
            )
            .andExpect(status().isOk());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
        Maladies testMaladies = maladiesList.get(maladiesList.size() - 1);
        assertThat(testMaladies.getNomMaladie()).isEqualTo(UPDATED_NOM_MALADIE);
        assertThat(testMaladies.getFamilleMaladie()).isEqualTo(UPDATED_FAMILLE_MALADIE);
        assertThat(testMaladies.getDescriptionMaladie()).isEqualTo(UPDATED_DESCRIPTION_MALADIE);
    }

    @Test
    @Transactional
    void patchNonExistingMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, maladies.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(maladies))
            )
            .andExpect(status().isBadRequest());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMaladies() throws Exception {
        int databaseSizeBeforeUpdate = maladiesRepository.findAll().size();
        maladies.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMaladiesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(maladies)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Maladies in the database
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMaladies() throws Exception {
        // Initialize the database
        maladiesRepository.saveAndFlush(maladies);

        int databaseSizeBeforeDelete = maladiesRepository.findAll().size();

        // Delete the maladies
        restMaladiesMockMvc
            .perform(delete(ENTITY_API_URL_ID, maladies.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Maladies> maladiesList = maladiesRepository.findAll();
        assertThat(maladiesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
