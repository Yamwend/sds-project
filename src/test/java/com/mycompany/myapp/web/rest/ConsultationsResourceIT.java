package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Consultations;
import com.mycompany.myapp.domain.enumeration.TypeConsultation;
import com.mycompany.myapp.repository.ConsultationsRepository;
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
 * Integration tests for the {@link ConsultationsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ConsultationsResourceIT {

    private static final TypeConsultation DEFAULT_TYPE_CONSULTATION = TypeConsultation.CPN;
    private static final TypeConsultation UPDATED_TYPE_CONSULTATION = TypeConsultation.CPON;

    private static final String DEFAULT_OBSERVATIONS_CONSLTATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATIONS_CONSLTATION = "BBBBBBBBBB";

    private static final Integer DEFAULT_FRAIS_CONSULTION = 1;
    private static final Integer UPDATED_FRAIS_CONSULTION = 2;

    private static final ZonedDateTime DEFAULT_DATE_CONSULTION = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_CONSULTION = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/consultations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsultationsRepository consultationsRepository;

    @Mock
    private ConsultationsRepository consultationsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsultationsMockMvc;

    private Consultations consultations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultations createEntity(EntityManager em) {
        Consultations consultations = new Consultations()
            .typeConsultation(DEFAULT_TYPE_CONSULTATION)
            .observationsConsltation(DEFAULT_OBSERVATIONS_CONSLTATION)
            .fraisConsultion(DEFAULT_FRAIS_CONSULTION)
            .dateConsultion(DEFAULT_DATE_CONSULTION);
        return consultations;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consultations createUpdatedEntity(EntityManager em) {
        Consultations consultations = new Consultations()
            .typeConsultation(UPDATED_TYPE_CONSULTATION)
            .observationsConsltation(UPDATED_OBSERVATIONS_CONSLTATION)
            .fraisConsultion(UPDATED_FRAIS_CONSULTION)
            .dateConsultion(UPDATED_DATE_CONSULTION);
        return consultations;
    }

    @BeforeEach
    public void initTest() {
        consultations = createEntity(em);
    }

    @Test
    @Transactional
    void createConsultations() throws Exception {
        int databaseSizeBeforeCreate = consultationsRepository.findAll().size();
        // Create the Consultations
        restConsultationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultations)))
            .andExpect(status().isCreated());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeCreate + 1);
        Consultations testConsultations = consultationsList.get(consultationsList.size() - 1);
        assertThat(testConsultations.getTypeConsultation()).isEqualTo(DEFAULT_TYPE_CONSULTATION);
        assertThat(testConsultations.getObservationsConsltation()).isEqualTo(DEFAULT_OBSERVATIONS_CONSLTATION);
        assertThat(testConsultations.getFraisConsultion()).isEqualTo(DEFAULT_FRAIS_CONSULTION);
        assertThat(testConsultations.getDateConsultion()).isEqualTo(DEFAULT_DATE_CONSULTION);
    }

    @Test
    @Transactional
    void createConsultationsWithExistingId() throws Exception {
        // Create the Consultations with an existing ID
        consultations.setId(1L);

        int databaseSizeBeforeCreate = consultationsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultationsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultations)))
            .andExpect(status().isBadRequest());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsultations() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        // Get all the consultationsList
        restConsultationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consultations.getId().intValue())))
            .andExpect(jsonPath("$.[*].typeConsultation").value(hasItem(DEFAULT_TYPE_CONSULTATION.toString())))
            .andExpect(jsonPath("$.[*].observationsConsltation").value(hasItem(DEFAULT_OBSERVATIONS_CONSLTATION)))
            .andExpect(jsonPath("$.[*].fraisConsultion").value(hasItem(DEFAULT_FRAIS_CONSULTION)))
            .andExpect(jsonPath("$.[*].dateConsultion").value(hasItem(sameInstant(DEFAULT_DATE_CONSULTION))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllConsultationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(consultationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restConsultationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(consultationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllConsultationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(consultationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restConsultationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(consultationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getConsultations() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        // Get the consultations
        restConsultationsMockMvc
            .perform(get(ENTITY_API_URL_ID, consultations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consultations.getId().intValue()))
            .andExpect(jsonPath("$.typeConsultation").value(DEFAULT_TYPE_CONSULTATION.toString()))
            .andExpect(jsonPath("$.observationsConsltation").value(DEFAULT_OBSERVATIONS_CONSLTATION))
            .andExpect(jsonPath("$.fraisConsultion").value(DEFAULT_FRAIS_CONSULTION))
            .andExpect(jsonPath("$.dateConsultion").value(sameInstant(DEFAULT_DATE_CONSULTION)));
    }

    @Test
    @Transactional
    void getNonExistingConsultations() throws Exception {
        // Get the consultations
        restConsultationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsultations() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();

        // Update the consultations
        Consultations updatedConsultations = consultationsRepository.findById(consultations.getId()).get();
        // Disconnect from session so that the updates on updatedConsultations are not directly saved in db
        em.detach(updatedConsultations);
        updatedConsultations
            .typeConsultation(UPDATED_TYPE_CONSULTATION)
            .observationsConsltation(UPDATED_OBSERVATIONS_CONSLTATION)
            .fraisConsultion(UPDATED_FRAIS_CONSULTION)
            .dateConsultion(UPDATED_DATE_CONSULTION);

        restConsultationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsultations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsultations))
            )
            .andExpect(status().isOk());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
        Consultations testConsultations = consultationsList.get(consultationsList.size() - 1);
        assertThat(testConsultations.getTypeConsultation()).isEqualTo(UPDATED_TYPE_CONSULTATION);
        assertThat(testConsultations.getObservationsConsltation()).isEqualTo(UPDATED_OBSERVATIONS_CONSLTATION);
        assertThat(testConsultations.getFraisConsultion()).isEqualTo(UPDATED_FRAIS_CONSULTION);
        assertThat(testConsultations.getDateConsultion()).isEqualTo(UPDATED_DATE_CONSULTION);
    }

    @Test
    @Transactional
    void putNonExistingConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consultations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consultations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consultations)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsultationsWithPatch() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();

        // Update the consultations using partial update
        Consultations partialUpdatedConsultations = new Consultations();
        partialUpdatedConsultations.setId(consultations.getId());

        partialUpdatedConsultations
            .typeConsultation(UPDATED_TYPE_CONSULTATION)
            .observationsConsltation(UPDATED_OBSERVATIONS_CONSLTATION)
            .dateConsultion(UPDATED_DATE_CONSULTION);

        restConsultationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultations))
            )
            .andExpect(status().isOk());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
        Consultations testConsultations = consultationsList.get(consultationsList.size() - 1);
        assertThat(testConsultations.getTypeConsultation()).isEqualTo(UPDATED_TYPE_CONSULTATION);
        assertThat(testConsultations.getObservationsConsltation()).isEqualTo(UPDATED_OBSERVATIONS_CONSLTATION);
        assertThat(testConsultations.getFraisConsultion()).isEqualTo(DEFAULT_FRAIS_CONSULTION);
        assertThat(testConsultations.getDateConsultion()).isEqualTo(UPDATED_DATE_CONSULTION);
    }

    @Test
    @Transactional
    void fullUpdateConsultationsWithPatch() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();

        // Update the consultations using partial update
        Consultations partialUpdatedConsultations = new Consultations();
        partialUpdatedConsultations.setId(consultations.getId());

        partialUpdatedConsultations
            .typeConsultation(UPDATED_TYPE_CONSULTATION)
            .observationsConsltation(UPDATED_OBSERVATIONS_CONSLTATION)
            .fraisConsultion(UPDATED_FRAIS_CONSULTION)
            .dateConsultion(UPDATED_DATE_CONSULTION);

        restConsultationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsultations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsultations))
            )
            .andExpect(status().isOk());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
        Consultations testConsultations = consultationsList.get(consultationsList.size() - 1);
        assertThat(testConsultations.getTypeConsultation()).isEqualTo(UPDATED_TYPE_CONSULTATION);
        assertThat(testConsultations.getObservationsConsltation()).isEqualTo(UPDATED_OBSERVATIONS_CONSLTATION);
        assertThat(testConsultations.getFraisConsultion()).isEqualTo(UPDATED_FRAIS_CONSULTION);
        assertThat(testConsultations.getDateConsultion()).isEqualTo(UPDATED_DATE_CONSULTION);
    }

    @Test
    @Transactional
    void patchNonExistingConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consultations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consultations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsultations() throws Exception {
        int databaseSizeBeforeUpdate = consultationsRepository.findAll().size();
        consultations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultationsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consultations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consultations in the database
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsultations() throws Exception {
        // Initialize the database
        consultationsRepository.saveAndFlush(consultations);

        int databaseSizeBeforeDelete = consultationsRepository.findAll().size();

        // Delete the consultations
        restConsultationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, consultations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consultations> consultationsList = consultationsRepository.findAll();
        assertThat(consultationsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
