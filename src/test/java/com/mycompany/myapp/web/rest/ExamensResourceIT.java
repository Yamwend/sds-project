package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Examens;
import com.mycompany.myapp.repository.ExamensRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link ExamensResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExamensResourceIT {

    private static final String DEFAULT_NOM_EXAMEN = "AAAAAAAAAA";
    private static final String UPDATED_NOM_EXAMEN = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE_EXAMEN = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_EXAMEN = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_EXAMEN = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_EXAMEN = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/examens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExamensRepository examensRepository;

    @Mock
    private ExamensRepository examensRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExamensMockMvc;

    private Examens examens;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examens createEntity(EntityManager em) {
        Examens examens = new Examens().nomExamen(DEFAULT_NOM_EXAMEN).typeExamen(DEFAULT_TYPE_EXAMEN).dateExamen(DEFAULT_DATE_EXAMEN);
        return examens;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Examens createUpdatedEntity(EntityManager em) {
        Examens examens = new Examens().nomExamen(UPDATED_NOM_EXAMEN).typeExamen(UPDATED_TYPE_EXAMEN).dateExamen(UPDATED_DATE_EXAMEN);
        return examens;
    }

    @BeforeEach
    public void initTest() {
        examens = createEntity(em);
    }

    @Test
    @Transactional
    void createExamens() throws Exception {
        int databaseSizeBeforeCreate = examensRepository.findAll().size();
        // Create the Examens
        restExamensMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examens)))
            .andExpect(status().isCreated());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeCreate + 1);
        Examens testExamens = examensList.get(examensList.size() - 1);
        assertThat(testExamens.getNomExamen()).isEqualTo(DEFAULT_NOM_EXAMEN);
        assertThat(testExamens.getTypeExamen()).isEqualTo(DEFAULT_TYPE_EXAMEN);
        assertThat(testExamens.getDateExamen()).isEqualTo(DEFAULT_DATE_EXAMEN);
    }

    @Test
    @Transactional
    void createExamensWithExistingId() throws Exception {
        // Create the Examens with an existing ID
        examens.setId(1L);

        int databaseSizeBeforeCreate = examensRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExamensMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examens)))
            .andExpect(status().isBadRequest());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExamens() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        // Get all the examensList
        restExamensMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(examens.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomExamen").value(hasItem(DEFAULT_NOM_EXAMEN)))
            .andExpect(jsonPath("$.[*].typeExamen").value(hasItem(DEFAULT_TYPE_EXAMEN)))
            .andExpect(jsonPath("$.[*].dateExamen").value(hasItem(sameInstant(DEFAULT_DATE_EXAMEN))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExamensWithEagerRelationshipsIsEnabled() throws Exception {
        when(examensRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExamensMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(examensRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExamensWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(examensRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExamensMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(examensRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getExamens() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        // Get the examens
        restExamensMockMvc
            .perform(get(ENTITY_API_URL_ID, examens.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(examens.getId().intValue()))
            .andExpect(jsonPath("$.nomExamen").value(DEFAULT_NOM_EXAMEN))
            .andExpect(jsonPath("$.typeExamen").value(DEFAULT_TYPE_EXAMEN))
            .andExpect(jsonPath("$.dateExamen").value(sameInstant(DEFAULT_DATE_EXAMEN)));
    }

    @Test
    @Transactional
    void getNonExistingExamens() throws Exception {
        // Get the examens
        restExamensMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewExamens() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        int databaseSizeBeforeUpdate = examensRepository.findAll().size();

        // Update the examens
        Examens updatedExamens = examensRepository.findById(examens.getId()).get();
        // Disconnect from session so that the updates on updatedExamens are not directly saved in db
        em.detach(updatedExamens);
        updatedExamens.nomExamen(UPDATED_NOM_EXAMEN).typeExamen(UPDATED_TYPE_EXAMEN).dateExamen(UPDATED_DATE_EXAMEN);

        restExamensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExamens.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExamens))
            )
            .andExpect(status().isOk());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
        Examens testExamens = examensList.get(examensList.size() - 1);
        assertThat(testExamens.getNomExamen()).isEqualTo(UPDATED_NOM_EXAMEN);
        assertThat(testExamens.getTypeExamen()).isEqualTo(UPDATED_TYPE_EXAMEN);
        assertThat(testExamens.getDateExamen()).isEqualTo(UPDATED_DATE_EXAMEN);
    }

    @Test
    @Transactional
    void putNonExistingExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, examens.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(examens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(examens)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExamensWithPatch() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        int databaseSizeBeforeUpdate = examensRepository.findAll().size();

        // Update the examens using partial update
        Examens partialUpdatedExamens = new Examens();
        partialUpdatedExamens.setId(examens.getId());

        partialUpdatedExamens.nomExamen(UPDATED_NOM_EXAMEN);

        restExamensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamens))
            )
            .andExpect(status().isOk());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
        Examens testExamens = examensList.get(examensList.size() - 1);
        assertThat(testExamens.getNomExamen()).isEqualTo(UPDATED_NOM_EXAMEN);
        assertThat(testExamens.getTypeExamen()).isEqualTo(DEFAULT_TYPE_EXAMEN);
        assertThat(testExamens.getDateExamen()).isEqualTo(DEFAULT_DATE_EXAMEN);
    }

    @Test
    @Transactional
    void fullUpdateExamensWithPatch() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        int databaseSizeBeforeUpdate = examensRepository.findAll().size();

        // Update the examens using partial update
        Examens partialUpdatedExamens = new Examens();
        partialUpdatedExamens.setId(examens.getId());

        partialUpdatedExamens.nomExamen(UPDATED_NOM_EXAMEN).typeExamen(UPDATED_TYPE_EXAMEN).dateExamen(UPDATED_DATE_EXAMEN);

        restExamensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExamens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExamens))
            )
            .andExpect(status().isOk());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
        Examens testExamens = examensList.get(examensList.size() - 1);
        assertThat(testExamens.getNomExamen()).isEqualTo(UPDATED_NOM_EXAMEN);
        assertThat(testExamens.getTypeExamen()).isEqualTo(UPDATED_TYPE_EXAMEN);
        assertThat(testExamens.getDateExamen()).isEqualTo(UPDATED_DATE_EXAMEN);
    }

    @Test
    @Transactional
    void patchNonExistingExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, examens.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(examens))
            )
            .andExpect(status().isBadRequest());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExamens() throws Exception {
        int databaseSizeBeforeUpdate = examensRepository.findAll().size();
        examens.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExamensMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(examens)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Examens in the database
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExamens() throws Exception {
        // Initialize the database
        examensRepository.saveAndFlush(examens);

        int databaseSizeBeforeDelete = examensRepository.findAll().size();

        // Delete the examens
        restExamensMockMvc
            .perform(delete(ENTITY_API_URL_ID, examens.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Examens> examensList = examensRepository.findAll();
        assertThat(examensList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
