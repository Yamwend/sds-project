package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Laboratoires;
import com.mycompany.myapp.repository.LaboratoiresRepository;
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
 * Integration tests for the {@link LaboratoiresResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LaboratoiresResourceIT {

    private static final String DEFAULT_NOM_LABORATOIRE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_LABORATOIRE = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVATIONS_EXAMENS = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATIONS_EXAMENS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/laboratoires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LaboratoiresRepository laboratoiresRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLaboratoiresMockMvc;

    private Laboratoires laboratoires;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laboratoires createEntity(EntityManager em) {
        Laboratoires laboratoires = new Laboratoires()
            .nomLaboratoire(DEFAULT_NOM_LABORATOIRE)
            .observationsExamens(DEFAULT_OBSERVATIONS_EXAMENS);
        return laboratoires;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laboratoires createUpdatedEntity(EntityManager em) {
        Laboratoires laboratoires = new Laboratoires()
            .nomLaboratoire(UPDATED_NOM_LABORATOIRE)
            .observationsExamens(UPDATED_OBSERVATIONS_EXAMENS);
        return laboratoires;
    }

    @BeforeEach
    public void initTest() {
        laboratoires = createEntity(em);
    }

    @Test
    @Transactional
    void createLaboratoires() throws Exception {
        int databaseSizeBeforeCreate = laboratoiresRepository.findAll().size();
        // Create the Laboratoires
        restLaboratoiresMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoires)))
            .andExpect(status().isCreated());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeCreate + 1);
        Laboratoires testLaboratoires = laboratoiresList.get(laboratoiresList.size() - 1);
        assertThat(testLaboratoires.getNomLaboratoire()).isEqualTo(DEFAULT_NOM_LABORATOIRE);
        assertThat(testLaboratoires.getObservationsExamens()).isEqualTo(DEFAULT_OBSERVATIONS_EXAMENS);
    }

    @Test
    @Transactional
    void createLaboratoiresWithExistingId() throws Exception {
        // Create the Laboratoires with an existing ID
        laboratoires.setId(1L);

        int databaseSizeBeforeCreate = laboratoiresRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLaboratoiresMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoires)))
            .andExpect(status().isBadRequest());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLaboratoires() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        // Get all the laboratoiresList
        restLaboratoiresMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(laboratoires.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomLaboratoire").value(hasItem(DEFAULT_NOM_LABORATOIRE)))
            .andExpect(jsonPath("$.[*].observationsExamens").value(hasItem(DEFAULT_OBSERVATIONS_EXAMENS)));
    }

    @Test
    @Transactional
    void getLaboratoires() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        // Get the laboratoires
        restLaboratoiresMockMvc
            .perform(get(ENTITY_API_URL_ID, laboratoires.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(laboratoires.getId().intValue()))
            .andExpect(jsonPath("$.nomLaboratoire").value(DEFAULT_NOM_LABORATOIRE))
            .andExpect(jsonPath("$.observationsExamens").value(DEFAULT_OBSERVATIONS_EXAMENS));
    }

    @Test
    @Transactional
    void getNonExistingLaboratoires() throws Exception {
        // Get the laboratoires
        restLaboratoiresMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLaboratoires() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();

        // Update the laboratoires
        Laboratoires updatedLaboratoires = laboratoiresRepository.findById(laboratoires.getId()).get();
        // Disconnect from session so that the updates on updatedLaboratoires are not directly saved in db
        em.detach(updatedLaboratoires);
        updatedLaboratoires.nomLaboratoire(UPDATED_NOM_LABORATOIRE).observationsExamens(UPDATED_OBSERVATIONS_EXAMENS);

        restLaboratoiresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLaboratoires.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLaboratoires))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
        Laboratoires testLaboratoires = laboratoiresList.get(laboratoiresList.size() - 1);
        assertThat(testLaboratoires.getNomLaboratoire()).isEqualTo(UPDATED_NOM_LABORATOIRE);
        assertThat(testLaboratoires.getObservationsExamens()).isEqualTo(UPDATED_OBSERVATIONS_EXAMENS);
    }

    @Test
    @Transactional
    void putNonExistingLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, laboratoires.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laboratoires))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laboratoires))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laboratoires)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLaboratoiresWithPatch() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();

        // Update the laboratoires using partial update
        Laboratoires partialUpdatedLaboratoires = new Laboratoires();
        partialUpdatedLaboratoires.setId(laboratoires.getId());

        restLaboratoiresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaboratoires.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaboratoires))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
        Laboratoires testLaboratoires = laboratoiresList.get(laboratoiresList.size() - 1);
        assertThat(testLaboratoires.getNomLaboratoire()).isEqualTo(DEFAULT_NOM_LABORATOIRE);
        assertThat(testLaboratoires.getObservationsExamens()).isEqualTo(DEFAULT_OBSERVATIONS_EXAMENS);
    }

    @Test
    @Transactional
    void fullUpdateLaboratoiresWithPatch() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();

        // Update the laboratoires using partial update
        Laboratoires partialUpdatedLaboratoires = new Laboratoires();
        partialUpdatedLaboratoires.setId(laboratoires.getId());

        partialUpdatedLaboratoires.nomLaboratoire(UPDATED_NOM_LABORATOIRE).observationsExamens(UPDATED_OBSERVATIONS_EXAMENS);

        restLaboratoiresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaboratoires.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaboratoires))
            )
            .andExpect(status().isOk());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
        Laboratoires testLaboratoires = laboratoiresList.get(laboratoiresList.size() - 1);
        assertThat(testLaboratoires.getNomLaboratoire()).isEqualTo(UPDATED_NOM_LABORATOIRE);
        assertThat(testLaboratoires.getObservationsExamens()).isEqualTo(UPDATED_OBSERVATIONS_EXAMENS);
    }

    @Test
    @Transactional
    void patchNonExistingLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, laboratoires.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laboratoires))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laboratoires))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLaboratoires() throws Exception {
        int databaseSizeBeforeUpdate = laboratoiresRepository.findAll().size();
        laboratoires.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaboratoiresMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(laboratoires))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laboratoires in the database
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLaboratoires() throws Exception {
        // Initialize the database
        laboratoiresRepository.saveAndFlush(laboratoires);

        int databaseSizeBeforeDelete = laboratoiresRepository.findAll().size();

        // Delete the laboratoires
        restLaboratoiresMockMvc
            .perform(delete(ENTITY_API_URL_ID, laboratoires.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Laboratoires> laboratoiresList = laboratoiresRepository.findAll();
        assertThat(laboratoiresList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
