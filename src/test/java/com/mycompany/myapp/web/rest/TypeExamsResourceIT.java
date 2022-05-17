package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.TypeExams;
import com.mycompany.myapp.repository.TypeExamsRepository;
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
 * Integration tests for the {@link TypeExamsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TypeExamsResourceIT {

    private static final String DEFAULT_LIBELLE_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRUPTION_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_DESCRUPTION_TYPE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/type-exams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TypeExamsRepository typeExamsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTypeExamsMockMvc;

    private TypeExams typeExams;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeExams createEntity(EntityManager em) {
        TypeExams typeExams = new TypeExams().libelleType(DEFAULT_LIBELLE_TYPE).descruptionType(DEFAULT_DESCRUPTION_TYPE);
        return typeExams;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TypeExams createUpdatedEntity(EntityManager em) {
        TypeExams typeExams = new TypeExams().libelleType(UPDATED_LIBELLE_TYPE).descruptionType(UPDATED_DESCRUPTION_TYPE);
        return typeExams;
    }

    @BeforeEach
    public void initTest() {
        typeExams = createEntity(em);
    }

    @Test
    @Transactional
    void createTypeExams() throws Exception {
        int databaseSizeBeforeCreate = typeExamsRepository.findAll().size();
        // Create the TypeExams
        restTypeExamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeExams)))
            .andExpect(status().isCreated());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeCreate + 1);
        TypeExams testTypeExams = typeExamsList.get(typeExamsList.size() - 1);
        assertThat(testTypeExams.getLibelleType()).isEqualTo(DEFAULT_LIBELLE_TYPE);
        assertThat(testTypeExams.getDescruptionType()).isEqualTo(DEFAULT_DESCRUPTION_TYPE);
    }

    @Test
    @Transactional
    void createTypeExamsWithExistingId() throws Exception {
        // Create the TypeExams with an existing ID
        typeExams.setId(1L);

        int databaseSizeBeforeCreate = typeExamsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTypeExamsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeExams)))
            .andExpect(status().isBadRequest());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTypeExams() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        // Get all the typeExamsList
        restTypeExamsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(typeExams.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelleType").value(hasItem(DEFAULT_LIBELLE_TYPE)))
            .andExpect(jsonPath("$.[*].descruptionType").value(hasItem(DEFAULT_DESCRUPTION_TYPE)));
    }

    @Test
    @Transactional
    void getTypeExams() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        // Get the typeExams
        restTypeExamsMockMvc
            .perform(get(ENTITY_API_URL_ID, typeExams.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(typeExams.getId().intValue()))
            .andExpect(jsonPath("$.libelleType").value(DEFAULT_LIBELLE_TYPE))
            .andExpect(jsonPath("$.descruptionType").value(DEFAULT_DESCRUPTION_TYPE));
    }

    @Test
    @Transactional
    void getNonExistingTypeExams() throws Exception {
        // Get the typeExams
        restTypeExamsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTypeExams() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();

        // Update the typeExams
        TypeExams updatedTypeExams = typeExamsRepository.findById(typeExams.getId()).get();
        // Disconnect from session so that the updates on updatedTypeExams are not directly saved in db
        em.detach(updatedTypeExams);
        updatedTypeExams.libelleType(UPDATED_LIBELLE_TYPE).descruptionType(UPDATED_DESCRUPTION_TYPE);

        restTypeExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTypeExams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTypeExams))
            )
            .andExpect(status().isOk());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
        TypeExams testTypeExams = typeExamsList.get(typeExamsList.size() - 1);
        assertThat(testTypeExams.getLibelleType()).isEqualTo(UPDATED_LIBELLE_TYPE);
        assertThat(testTypeExams.getDescruptionType()).isEqualTo(UPDATED_DESCRUPTION_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, typeExams.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(typeExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(typeExams)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTypeExamsWithPatch() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();

        // Update the typeExams using partial update
        TypeExams partialUpdatedTypeExams = new TypeExams();
        partialUpdatedTypeExams.setId(typeExams.getId());

        restTypeExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeExams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeExams))
            )
            .andExpect(status().isOk());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
        TypeExams testTypeExams = typeExamsList.get(typeExamsList.size() - 1);
        assertThat(testTypeExams.getLibelleType()).isEqualTo(DEFAULT_LIBELLE_TYPE);
        assertThat(testTypeExams.getDescruptionType()).isEqualTo(DEFAULT_DESCRUPTION_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateTypeExamsWithPatch() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();

        // Update the typeExams using partial update
        TypeExams partialUpdatedTypeExams = new TypeExams();
        partialUpdatedTypeExams.setId(typeExams.getId());

        partialUpdatedTypeExams.libelleType(UPDATED_LIBELLE_TYPE).descruptionType(UPDATED_DESCRUPTION_TYPE);

        restTypeExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTypeExams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTypeExams))
            )
            .andExpect(status().isOk());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
        TypeExams testTypeExams = typeExamsList.get(typeExamsList.size() - 1);
        assertThat(testTypeExams.getLibelleType()).isEqualTo(UPDATED_LIBELLE_TYPE);
        assertThat(testTypeExams.getDescruptionType()).isEqualTo(UPDATED_DESCRUPTION_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, typeExams.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(typeExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTypeExams() throws Exception {
        int databaseSizeBeforeUpdate = typeExamsRepository.findAll().size();
        typeExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTypeExamsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(typeExams))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TypeExams in the database
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTypeExams() throws Exception {
        // Initialize the database
        typeExamsRepository.saveAndFlush(typeExams);

        int databaseSizeBeforeDelete = typeExamsRepository.findAll().size();

        // Delete the typeExams
        restTypeExamsMockMvc
            .perform(delete(ENTITY_API_URL_ID, typeExams.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TypeExams> typeExamsList = typeExamsRepository.findAll();
        assertThat(typeExamsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
