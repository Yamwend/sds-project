package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Patients;
import com.mycompany.myapp.domain.enumeration.Sexe;
import com.mycompany.myapp.repository.PatientsRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link PatientsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PatientsResourceIT {

    private static final String DEFAULT_CODE_PAT = "AAAAAAAAAA";
    private static final String UPDATED_CODE_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_PAT = "AAAAAAAAAA";
    private static final String UPDATED_NOM_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM_PAT = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM_PAT = "BBBBBBBBBB";

    private static final Sexe DEFAULT_SEXE_PAT = Sexe.MASCULIN;
    private static final Sexe UPDATED_SEXE_PAT = Sexe.FEMININ;

    private static final String DEFAULT_ADRESSE_PAT = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE_PAT = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL_PAT = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_ORIGINE_PAT = "AAAAAAAAAA";
    private static final String UPDATED_ORIGINE_PAT = "BBBBBBBBBB";

    private static final String DEFAULT_PROFESSION_PAT = "AAAAAAAAAA";
    private static final String UPDATED_PROFESSION_PAT = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_AGE_PAT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_AGE_PAT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PatientsRepository patientsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPatientsMockMvc;

    private Patients patients;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patients createEntity(EntityManager em) {
        Patients patients = new Patients()
            .codePat(DEFAULT_CODE_PAT)
            .nomPat(DEFAULT_NOM_PAT)
            .prenomPat(DEFAULT_PRENOM_PAT)
            .sexePat(DEFAULT_SEXE_PAT)
            .adressePat(DEFAULT_ADRESSE_PAT)
            .telephonePat(DEFAULT_TELEPHONE_PAT)
            .emailPat(DEFAULT_EMAIL_PAT)
            .originePat(DEFAULT_ORIGINE_PAT)
            .professionPat(DEFAULT_PROFESSION_PAT)
            .agePat(DEFAULT_AGE_PAT);
        return patients;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patients createUpdatedEntity(EntityManager em) {
        Patients patients = new Patients()
            .codePat(UPDATED_CODE_PAT)
            .nomPat(UPDATED_NOM_PAT)
            .prenomPat(UPDATED_PRENOM_PAT)
            .sexePat(UPDATED_SEXE_PAT)
            .adressePat(UPDATED_ADRESSE_PAT)
            .telephonePat(UPDATED_TELEPHONE_PAT)
            .emailPat(UPDATED_EMAIL_PAT)
            .originePat(UPDATED_ORIGINE_PAT)
            .professionPat(UPDATED_PROFESSION_PAT)
            .agePat(UPDATED_AGE_PAT);
        return patients;
    }

    @BeforeEach
    public void initTest() {
        patients = createEntity(em);
    }

    @Test
    @Transactional
    void createPatients() throws Exception {
        int databaseSizeBeforeCreate = patientsRepository.findAll().size();
        // Create the Patients
        restPatientsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isCreated());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate + 1);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getCodePat()).isEqualTo(DEFAULT_CODE_PAT);
        assertThat(testPatients.getNomPat()).isEqualTo(DEFAULT_NOM_PAT);
        assertThat(testPatients.getPrenomPat()).isEqualTo(DEFAULT_PRENOM_PAT);
        assertThat(testPatients.getSexePat()).isEqualTo(DEFAULT_SEXE_PAT);
        assertThat(testPatients.getAdressePat()).isEqualTo(DEFAULT_ADRESSE_PAT);
        assertThat(testPatients.getTelephonePat()).isEqualTo(DEFAULT_TELEPHONE_PAT);
        assertThat(testPatients.getEmailPat()).isEqualTo(DEFAULT_EMAIL_PAT);
        assertThat(testPatients.getOriginePat()).isEqualTo(DEFAULT_ORIGINE_PAT);
        assertThat(testPatients.getProfessionPat()).isEqualTo(DEFAULT_PROFESSION_PAT);
        assertThat(testPatients.getAgePat()).isEqualTo(DEFAULT_AGE_PAT);
    }

    @Test
    @Transactional
    void createPatientsWithExistingId() throws Exception {
        // Create the Patients with an existing ID
        patients.setId(1L);

        int databaseSizeBeforeCreate = patientsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        // Get all the patientsList
        restPatientsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patients.getId().intValue())))
            .andExpect(jsonPath("$.[*].codePat").value(hasItem(DEFAULT_CODE_PAT)))
            .andExpect(jsonPath("$.[*].nomPat").value(hasItem(DEFAULT_NOM_PAT)))
            .andExpect(jsonPath("$.[*].prenomPat").value(hasItem(DEFAULT_PRENOM_PAT)))
            .andExpect(jsonPath("$.[*].sexePat").value(hasItem(DEFAULT_SEXE_PAT.toString())))
            .andExpect(jsonPath("$.[*].adressePat").value(hasItem(DEFAULT_ADRESSE_PAT)))
            .andExpect(jsonPath("$.[*].telephonePat").value(hasItem(DEFAULT_TELEPHONE_PAT)))
            .andExpect(jsonPath("$.[*].emailPat").value(hasItem(DEFAULT_EMAIL_PAT)))
            .andExpect(jsonPath("$.[*].originePat").value(hasItem(DEFAULT_ORIGINE_PAT)))
            .andExpect(jsonPath("$.[*].professionPat").value(hasItem(DEFAULT_PROFESSION_PAT)))
            .andExpect(jsonPath("$.[*].agePat").value(hasItem(sameInstant(DEFAULT_AGE_PAT))));
    }

    @Test
    @Transactional
    void getPatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        // Get the patients
        restPatientsMockMvc
            .perform(get(ENTITY_API_URL_ID, patients.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patients.getId().intValue()))
            .andExpect(jsonPath("$.codePat").value(DEFAULT_CODE_PAT))
            .andExpect(jsonPath("$.nomPat").value(DEFAULT_NOM_PAT))
            .andExpect(jsonPath("$.prenomPat").value(DEFAULT_PRENOM_PAT))
            .andExpect(jsonPath("$.sexePat").value(DEFAULT_SEXE_PAT.toString()))
            .andExpect(jsonPath("$.adressePat").value(DEFAULT_ADRESSE_PAT))
            .andExpect(jsonPath("$.telephonePat").value(DEFAULT_TELEPHONE_PAT))
            .andExpect(jsonPath("$.emailPat").value(DEFAULT_EMAIL_PAT))
            .andExpect(jsonPath("$.originePat").value(DEFAULT_ORIGINE_PAT))
            .andExpect(jsonPath("$.professionPat").value(DEFAULT_PROFESSION_PAT))
            .andExpect(jsonPath("$.agePat").value(sameInstant(DEFAULT_AGE_PAT)));
    }

    @Test
    @Transactional
    void getNonExistingPatients() throws Exception {
        // Get the patients
        restPatientsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients
        Patients updatedPatients = patientsRepository.findById(patients.getId()).get();
        // Disconnect from session so that the updates on updatedPatients are not directly saved in db
        em.detach(updatedPatients);
        updatedPatients
            .codePat(UPDATED_CODE_PAT)
            .nomPat(UPDATED_NOM_PAT)
            .prenomPat(UPDATED_PRENOM_PAT)
            .sexePat(UPDATED_SEXE_PAT)
            .adressePat(UPDATED_ADRESSE_PAT)
            .telephonePat(UPDATED_TELEPHONE_PAT)
            .emailPat(UPDATED_EMAIL_PAT)
            .originePat(UPDATED_ORIGINE_PAT)
            .professionPat(UPDATED_PROFESSION_PAT)
            .agePat(UPDATED_AGE_PAT);

        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPatients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getCodePat()).isEqualTo(UPDATED_CODE_PAT);
        assertThat(testPatients.getNomPat()).isEqualTo(UPDATED_NOM_PAT);
        assertThat(testPatients.getPrenomPat()).isEqualTo(UPDATED_PRENOM_PAT);
        assertThat(testPatients.getSexePat()).isEqualTo(UPDATED_SEXE_PAT);
        assertThat(testPatients.getAdressePat()).isEqualTo(UPDATED_ADRESSE_PAT);
        assertThat(testPatients.getTelephonePat()).isEqualTo(UPDATED_TELEPHONE_PAT);
        assertThat(testPatients.getEmailPat()).isEqualTo(UPDATED_EMAIL_PAT);
        assertThat(testPatients.getOriginePat()).isEqualTo(UPDATED_ORIGINE_PAT);
        assertThat(testPatients.getProfessionPat()).isEqualTo(UPDATED_PROFESSION_PAT);
        assertThat(testPatients.getAgePat()).isEqualTo(UPDATED_AGE_PAT);
    }

    @Test
    @Transactional
    void putNonExistingPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, patients.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePatientsWithPatch() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients using partial update
        Patients partialUpdatedPatients = new Patients();
        partialUpdatedPatients.setId(patients.getId());

        partialUpdatedPatients.nomPat(UPDATED_NOM_PAT).emailPat(UPDATED_EMAIL_PAT);

        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getCodePat()).isEqualTo(DEFAULT_CODE_PAT);
        assertThat(testPatients.getNomPat()).isEqualTo(UPDATED_NOM_PAT);
        assertThat(testPatients.getPrenomPat()).isEqualTo(DEFAULT_PRENOM_PAT);
        assertThat(testPatients.getSexePat()).isEqualTo(DEFAULT_SEXE_PAT);
        assertThat(testPatients.getAdressePat()).isEqualTo(DEFAULT_ADRESSE_PAT);
        assertThat(testPatients.getTelephonePat()).isEqualTo(DEFAULT_TELEPHONE_PAT);
        assertThat(testPatients.getEmailPat()).isEqualTo(UPDATED_EMAIL_PAT);
        assertThat(testPatients.getOriginePat()).isEqualTo(DEFAULT_ORIGINE_PAT);
        assertThat(testPatients.getProfessionPat()).isEqualTo(DEFAULT_PROFESSION_PAT);
        assertThat(testPatients.getAgePat()).isEqualTo(DEFAULT_AGE_PAT);
    }

    @Test
    @Transactional
    void fullUpdatePatientsWithPatch() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();

        // Update the patients using partial update
        Patients partialUpdatedPatients = new Patients();
        partialUpdatedPatients.setId(patients.getId());

        partialUpdatedPatients
            .codePat(UPDATED_CODE_PAT)
            .nomPat(UPDATED_NOM_PAT)
            .prenomPat(UPDATED_PRENOM_PAT)
            .sexePat(UPDATED_SEXE_PAT)
            .adressePat(UPDATED_ADRESSE_PAT)
            .telephonePat(UPDATED_TELEPHONE_PAT)
            .emailPat(UPDATED_EMAIL_PAT)
            .originePat(UPDATED_ORIGINE_PAT)
            .professionPat(UPDATED_PROFESSION_PAT)
            .agePat(UPDATED_AGE_PAT);

        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatients))
            )
            .andExpect(status().isOk());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
        Patients testPatients = patientsList.get(patientsList.size() - 1);
        assertThat(testPatients.getCodePat()).isEqualTo(UPDATED_CODE_PAT);
        assertThat(testPatients.getNomPat()).isEqualTo(UPDATED_NOM_PAT);
        assertThat(testPatients.getPrenomPat()).isEqualTo(UPDATED_PRENOM_PAT);
        assertThat(testPatients.getSexePat()).isEqualTo(UPDATED_SEXE_PAT);
        assertThat(testPatients.getAdressePat()).isEqualTo(UPDATED_ADRESSE_PAT);
        assertThat(testPatients.getTelephonePat()).isEqualTo(UPDATED_TELEPHONE_PAT);
        assertThat(testPatients.getEmailPat()).isEqualTo(UPDATED_EMAIL_PAT);
        assertThat(testPatients.getOriginePat()).isEqualTo(UPDATED_ORIGINE_PAT);
        assertThat(testPatients.getProfessionPat()).isEqualTo(UPDATED_PROFESSION_PAT);
        assertThat(testPatients.getAgePat()).isEqualTo(UPDATED_AGE_PAT);
    }

    @Test
    @Transactional
    void patchNonExistingPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, patients.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patients))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPatients() throws Exception {
        int databaseSizeBeforeUpdate = patientsRepository.findAll().size();
        patients.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(patients)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patients in the database
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePatients() throws Exception {
        // Initialize the database
        patientsRepository.saveAndFlush(patients);

        int databaseSizeBeforeDelete = patientsRepository.findAll().size();

        // Delete the patients
        restPatientsMockMvc
            .perform(delete(ENTITY_API_URL_ID, patients.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patients> patientsList = patientsRepository.findAll();
        assertThat(patientsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
