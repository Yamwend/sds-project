package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Hospitalisations;
import com.mycompany.myapp.repository.HospitalisationsRepository;
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
 * Integration tests for the {@link HospitalisationsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HospitalisationsResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_ARRIVEE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_ARRIVEE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DATE_SORTIE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_SORTIE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_OBSERVATIONS_HOSPITALISATION = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVATIONS_HOSPITALISATION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/hospitalisations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HospitalisationsRepository hospitalisationsRepository;

    @Mock
    private HospitalisationsRepository hospitalisationsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHospitalisationsMockMvc;

    private Hospitalisations hospitalisations;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hospitalisations createEntity(EntityManager em) {
        Hospitalisations hospitalisations = new Hospitalisations()
            .dateArrivee(DEFAULT_DATE_ARRIVEE)
            .dateSortie(DEFAULT_DATE_SORTIE)
            .observationsHospitalisation(DEFAULT_OBSERVATIONS_HOSPITALISATION);
        return hospitalisations;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Hospitalisations createUpdatedEntity(EntityManager em) {
        Hospitalisations hospitalisations = new Hospitalisations()
            .dateArrivee(UPDATED_DATE_ARRIVEE)
            .dateSortie(UPDATED_DATE_SORTIE)
            .observationsHospitalisation(UPDATED_OBSERVATIONS_HOSPITALISATION);
        return hospitalisations;
    }

    @BeforeEach
    public void initTest() {
        hospitalisations = createEntity(em);
    }

    @Test
    @Transactional
    void createHospitalisations() throws Exception {
        int databaseSizeBeforeCreate = hospitalisationsRepository.findAll().size();
        // Create the Hospitalisations
        restHospitalisationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isCreated());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeCreate + 1);
        Hospitalisations testHospitalisations = hospitalisationsList.get(hospitalisationsList.size() - 1);
        assertThat(testHospitalisations.getDateArrivee()).isEqualTo(DEFAULT_DATE_ARRIVEE);
        assertThat(testHospitalisations.getDateSortie()).isEqualTo(DEFAULT_DATE_SORTIE);
        assertThat(testHospitalisations.getObservationsHospitalisation()).isEqualTo(DEFAULT_OBSERVATIONS_HOSPITALISATION);
    }

    @Test
    @Transactional
    void createHospitalisationsWithExistingId() throws Exception {
        // Create the Hospitalisations with an existing ID
        hospitalisations.setId(1L);

        int databaseSizeBeforeCreate = hospitalisationsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHospitalisationsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHospitalisations() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        // Get all the hospitalisationsList
        restHospitalisationsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(hospitalisations.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateArrivee").value(hasItem(sameInstant(DEFAULT_DATE_ARRIVEE))))
            .andExpect(jsonPath("$.[*].dateSortie").value(hasItem(sameInstant(DEFAULT_DATE_SORTIE))))
            .andExpect(jsonPath("$.[*].observationsHospitalisation").value(hasItem(DEFAULT_OBSERVATIONS_HOSPITALISATION)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHospitalisationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(hospitalisationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHospitalisationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(hospitalisationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHospitalisationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(hospitalisationsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHospitalisationsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(hospitalisationsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getHospitalisations() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        // Get the hospitalisations
        restHospitalisationsMockMvc
            .perform(get(ENTITY_API_URL_ID, hospitalisations.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(hospitalisations.getId().intValue()))
            .andExpect(jsonPath("$.dateArrivee").value(sameInstant(DEFAULT_DATE_ARRIVEE)))
            .andExpect(jsonPath("$.dateSortie").value(sameInstant(DEFAULT_DATE_SORTIE)))
            .andExpect(jsonPath("$.observationsHospitalisation").value(DEFAULT_OBSERVATIONS_HOSPITALISATION));
    }

    @Test
    @Transactional
    void getNonExistingHospitalisations() throws Exception {
        // Get the hospitalisations
        restHospitalisationsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewHospitalisations() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();

        // Update the hospitalisations
        Hospitalisations updatedHospitalisations = hospitalisationsRepository.findById(hospitalisations.getId()).get();
        // Disconnect from session so that the updates on updatedHospitalisations are not directly saved in db
        em.detach(updatedHospitalisations);
        updatedHospitalisations
            .dateArrivee(UPDATED_DATE_ARRIVEE)
            .dateSortie(UPDATED_DATE_SORTIE)
            .observationsHospitalisation(UPDATED_OBSERVATIONS_HOSPITALISATION);

        restHospitalisationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHospitalisations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHospitalisations))
            )
            .andExpect(status().isOk());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
        Hospitalisations testHospitalisations = hospitalisationsList.get(hospitalisationsList.size() - 1);
        assertThat(testHospitalisations.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
        assertThat(testHospitalisations.getDateSortie()).isEqualTo(UPDATED_DATE_SORTIE);
        assertThat(testHospitalisations.getObservationsHospitalisation()).isEqualTo(UPDATED_OBSERVATIONS_HOSPITALISATION);
    }

    @Test
    @Transactional
    void putNonExistingHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, hospitalisations.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHospitalisationsWithPatch() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();

        // Update the hospitalisations using partial update
        Hospitalisations partialUpdatedHospitalisations = new Hospitalisations();
        partialUpdatedHospitalisations.setId(hospitalisations.getId());

        partialUpdatedHospitalisations.dateArrivee(UPDATED_DATE_ARRIVEE);

        restHospitalisationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHospitalisations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHospitalisations))
            )
            .andExpect(status().isOk());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
        Hospitalisations testHospitalisations = hospitalisationsList.get(hospitalisationsList.size() - 1);
        assertThat(testHospitalisations.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
        assertThat(testHospitalisations.getDateSortie()).isEqualTo(DEFAULT_DATE_SORTIE);
        assertThat(testHospitalisations.getObservationsHospitalisation()).isEqualTo(DEFAULT_OBSERVATIONS_HOSPITALISATION);
    }

    @Test
    @Transactional
    void fullUpdateHospitalisationsWithPatch() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();

        // Update the hospitalisations using partial update
        Hospitalisations partialUpdatedHospitalisations = new Hospitalisations();
        partialUpdatedHospitalisations.setId(hospitalisations.getId());

        partialUpdatedHospitalisations
            .dateArrivee(UPDATED_DATE_ARRIVEE)
            .dateSortie(UPDATED_DATE_SORTIE)
            .observationsHospitalisation(UPDATED_OBSERVATIONS_HOSPITALISATION);

        restHospitalisationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHospitalisations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHospitalisations))
            )
            .andExpect(status().isOk());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
        Hospitalisations testHospitalisations = hospitalisationsList.get(hospitalisationsList.size() - 1);
        assertThat(testHospitalisations.getDateArrivee()).isEqualTo(UPDATED_DATE_ARRIVEE);
        assertThat(testHospitalisations.getDateSortie()).isEqualTo(UPDATED_DATE_SORTIE);
        assertThat(testHospitalisations.getObservationsHospitalisation()).isEqualTo(UPDATED_OBSERVATIONS_HOSPITALISATION);
    }

    @Test
    @Transactional
    void patchNonExistingHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, hospitalisations.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isBadRequest());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHospitalisations() throws Exception {
        int databaseSizeBeforeUpdate = hospitalisationsRepository.findAll().size();
        hospitalisations.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHospitalisationsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(hospitalisations))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Hospitalisations in the database
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHospitalisations() throws Exception {
        // Initialize the database
        hospitalisationsRepository.saveAndFlush(hospitalisations);

        int databaseSizeBeforeDelete = hospitalisationsRepository.findAll().size();

        // Delete the hospitalisations
        restHospitalisationsMockMvc
            .perform(delete(ENTITY_API_URL_ID, hospitalisations.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Hospitalisations> hospitalisationsList = hospitalisationsRepository.findAll();
        assertThat(hospitalisationsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
