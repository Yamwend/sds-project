package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Traitements;
import com.mycompany.myapp.repository.TraitementsRepository;
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
 * Integration tests for the {@link TraitementsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TraitementsResourceIT {

    private static final String DEFAULT_OBSERVATIONS_TRAITEMENT = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATIONS_TRAITEMENT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DEBUT_TRAITEMENT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DEBUT_TRAITEMENT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_FIN_TRAITEMENT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FIN_TRAITEMENT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_ETAT_FIN_PATIENT = "AAAAAAAAAA";
    private static final String UPDATED_ETAT_FIN_PATIENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/traitements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TraitementsRepository traitementsRepository;

    @Mock
    private TraitementsRepository traitementsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTraitementsMockMvc;

    private Traitements traitements;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Traitements createEntity(EntityManager em) {
        Traitements traitements = new Traitements()
            .observationsTraitement(DEFAULT_OBSERVATIONS_TRAITEMENT)
            .debutTraitement(DEFAULT_DEBUT_TRAITEMENT)
            .finTraitement(DEFAULT_FIN_TRAITEMENT)
            .etatFinPatient(DEFAULT_ETAT_FIN_PATIENT);
        return traitements;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Traitements createUpdatedEntity(EntityManager em) {
        Traitements traitements = new Traitements()
            .observationsTraitement(UPDATED_OBSERVATIONS_TRAITEMENT)
            .debutTraitement(UPDATED_DEBUT_TRAITEMENT)
            .finTraitement(UPDATED_FIN_TRAITEMENT)
            .etatFinPatient(UPDATED_ETAT_FIN_PATIENT);
        return traitements;
    }

    @BeforeEach
    public void initTest() {
        traitements = createEntity(em);
    }

    @Test
    @Transactional
    void createTraitements() throws Exception {
        int databaseSizeBeforeCreate = traitementsRepository.findAll().size();
        // Create the Traitements
        restTraitementsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitements)))
            .andExpect(status().isCreated());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeCreate + 1);
        Traitements testTraitements = traitementsList.get(traitementsList.size() - 1);
        assertThat(testTraitements.getObservationsTraitement()).isEqualTo(DEFAULT_OBSERVATIONS_TRAITEMENT);
        assertThat(testTraitements.getDebutTraitement()).isEqualTo(DEFAULT_DEBUT_TRAITEMENT);
        assertThat(testTraitements.getFinTraitement()).isEqualTo(DEFAULT_FIN_TRAITEMENT);
        assertThat(testTraitements.getEtatFinPatient()).isEqualTo(DEFAULT_ETAT_FIN_PATIENT);
    }

    @Test
    @Transactional
    void createTraitementsWithExistingId() throws Exception {
        // Create the Traitements with an existing ID
        traitements.setId(1L);

        int databaseSizeBeforeCreate = traitementsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTraitementsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitements)))
            .andExpect(status().isBadRequest());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTraitements() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        // Get all the traitementsList
        restTraitementsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(traitements.getId().intValue())))
            .andExpect(jsonPath("$.[*].observationsTraitement").value(hasItem(DEFAULT_OBSERVATIONS_TRAITEMENT)))
            .andExpect(jsonPath("$.[*].debutTraitement").value(hasItem(sameInstant(DEFAULT_DEBUT_TRAITEMENT))))
            .andExpect(jsonPath("$.[*].finTraitement").value(hasItem(sameInstant(DEFAULT_FIN_TRAITEMENT))))
            .andExpect(jsonPath("$.[*].etatFinPatient").value(hasItem(DEFAULT_ETAT_FIN_PATIENT)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTraitementsWithEagerRelationshipsIsEnabled() throws Exception {
        when(traitementsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTraitementsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(traitementsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTraitementsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(traitementsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTraitementsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(traitementsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getTraitements() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        // Get the traitements
        restTraitementsMockMvc
            .perform(get(ENTITY_API_URL_ID, traitements.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(traitements.getId().intValue()))
            .andExpect(jsonPath("$.observationsTraitement").value(DEFAULT_OBSERVATIONS_TRAITEMENT))
            .andExpect(jsonPath("$.debutTraitement").value(sameInstant(DEFAULT_DEBUT_TRAITEMENT)))
            .andExpect(jsonPath("$.finTraitement").value(sameInstant(DEFAULT_FIN_TRAITEMENT)))
            .andExpect(jsonPath("$.etatFinPatient").value(DEFAULT_ETAT_FIN_PATIENT));
    }

    @Test
    @Transactional
    void getNonExistingTraitements() throws Exception {
        // Get the traitements
        restTraitementsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTraitements() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();

        // Update the traitements
        Traitements updatedTraitements = traitementsRepository.findById(traitements.getId()).get();
        // Disconnect from session so that the updates on updatedTraitements are not directly saved in db
        em.detach(updatedTraitements);
        updatedTraitements
            .observationsTraitement(UPDATED_OBSERVATIONS_TRAITEMENT)
            .debutTraitement(UPDATED_DEBUT_TRAITEMENT)
            .finTraitement(UPDATED_FIN_TRAITEMENT)
            .etatFinPatient(UPDATED_ETAT_FIN_PATIENT);

        restTraitementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTraitements.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTraitements))
            )
            .andExpect(status().isOk());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
        Traitements testTraitements = traitementsList.get(traitementsList.size() - 1);
        assertThat(testTraitements.getObservationsTraitement()).isEqualTo(UPDATED_OBSERVATIONS_TRAITEMENT);
        assertThat(testTraitements.getDebutTraitement()).isEqualTo(UPDATED_DEBUT_TRAITEMENT);
        assertThat(testTraitements.getFinTraitement()).isEqualTo(UPDATED_FIN_TRAITEMENT);
        assertThat(testTraitements.getEtatFinPatient()).isEqualTo(UPDATED_ETAT_FIN_PATIENT);
    }

    @Test
    @Transactional
    void putNonExistingTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, traitements.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(traitements))
            )
            .andExpect(status().isBadRequest());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(traitements))
            )
            .andExpect(status().isBadRequest());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(traitements)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTraitementsWithPatch() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();

        // Update the traitements using partial update
        Traitements partialUpdatedTraitements = new Traitements();
        partialUpdatedTraitements.setId(traitements.getId());

        partialUpdatedTraitements
            .observationsTraitement(UPDATED_OBSERVATIONS_TRAITEMENT)
            .finTraitement(UPDATED_FIN_TRAITEMENT)
            .etatFinPatient(UPDATED_ETAT_FIN_PATIENT);

        restTraitementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTraitements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTraitements))
            )
            .andExpect(status().isOk());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
        Traitements testTraitements = traitementsList.get(traitementsList.size() - 1);
        assertThat(testTraitements.getObservationsTraitement()).isEqualTo(UPDATED_OBSERVATIONS_TRAITEMENT);
        assertThat(testTraitements.getDebutTraitement()).isEqualTo(DEFAULT_DEBUT_TRAITEMENT);
        assertThat(testTraitements.getFinTraitement()).isEqualTo(UPDATED_FIN_TRAITEMENT);
        assertThat(testTraitements.getEtatFinPatient()).isEqualTo(UPDATED_ETAT_FIN_PATIENT);
    }

    @Test
    @Transactional
    void fullUpdateTraitementsWithPatch() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();

        // Update the traitements using partial update
        Traitements partialUpdatedTraitements = new Traitements();
        partialUpdatedTraitements.setId(traitements.getId());

        partialUpdatedTraitements
            .observationsTraitement(UPDATED_OBSERVATIONS_TRAITEMENT)
            .debutTraitement(UPDATED_DEBUT_TRAITEMENT)
            .finTraitement(UPDATED_FIN_TRAITEMENT)
            .etatFinPatient(UPDATED_ETAT_FIN_PATIENT);

        restTraitementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTraitements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTraitements))
            )
            .andExpect(status().isOk());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
        Traitements testTraitements = traitementsList.get(traitementsList.size() - 1);
        assertThat(testTraitements.getObservationsTraitement()).isEqualTo(UPDATED_OBSERVATIONS_TRAITEMENT);
        assertThat(testTraitements.getDebutTraitement()).isEqualTo(UPDATED_DEBUT_TRAITEMENT);
        assertThat(testTraitements.getFinTraitement()).isEqualTo(UPDATED_FIN_TRAITEMENT);
        assertThat(testTraitements.getEtatFinPatient()).isEqualTo(UPDATED_ETAT_FIN_PATIENT);
    }

    @Test
    @Transactional
    void patchNonExistingTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, traitements.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(traitements))
            )
            .andExpect(status().isBadRequest());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(traitements))
            )
            .andExpect(status().isBadRequest());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTraitements() throws Exception {
        int databaseSizeBeforeUpdate = traitementsRepository.findAll().size();
        traitements.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTraitementsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(traitements))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Traitements in the database
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTraitements() throws Exception {
        // Initialize the database
        traitementsRepository.saveAndFlush(traitements);

        int databaseSizeBeforeDelete = traitementsRepository.findAll().size();

        // Delete the traitements
        restTraitementsMockMvc
            .perform(delete(ENTITY_API_URL_ID, traitements.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Traitements> traitementsList = traitementsRepository.findAll();
        assertThat(traitementsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
