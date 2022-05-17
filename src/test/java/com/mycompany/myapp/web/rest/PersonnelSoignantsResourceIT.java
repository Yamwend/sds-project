package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.PersonnelSoignants;
import com.mycompany.myapp.domain.enumeration.Grade;
import com.mycompany.myapp.domain.enumeration.Sexe;
import com.mycompany.myapp.repository.PersonnelSoignantsRepository;
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
 * Integration tests for the {@link PersonnelSoignantsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PersonnelSoignantsResourceIT {

    private static final String DEFAULT_CODE_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_CODE_PERSONNE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_PERSONNE = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM_PERSONNE = "BBBBBBBBBB";

    private static final Grade DEFAULT_GRADE_PERSONNE = Grade.INFIRMIER;
    private static final Grade UPDATED_GRADE_PERSONNE = Grade.GENERALISTE;

    private static final String DEFAULT_FONCTION_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_FONCTION_PERSONNE = "BBBBBBBBBB";

    private static final String DEFAULT_TELPHONE_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_TELPHONE_PERSONNE = "BBBBBBBBBB";

    private static final Sexe DEFAULT_EMAIL_PERSONNE = Sexe.MASCULIN;
    private static final Sexe UPDATED_EMAIL_PERSONNE = Sexe.FEMININ;

    private static final String DEFAULT_ADRESSE_PERSONNE = "AAAAAAAAAA";
    private static final String UPDATED_ADRESSE_PERSONNE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_DE_NAISS_PERSONNE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_DE_NAISS_PERSONNE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/personnel-soignants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PersonnelSoignantsRepository personnelSoignantsRepository;

    @Mock
    private PersonnelSoignantsRepository personnelSoignantsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPersonnelSoignantsMockMvc;

    private PersonnelSoignants personnelSoignants;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonnelSoignants createEntity(EntityManager em) {
        PersonnelSoignants personnelSoignants = new PersonnelSoignants()
            .codePersonne(DEFAULT_CODE_PERSONNE)
            .nomPersonne(DEFAULT_NOM_PERSONNE)
            .prenomPersonne(DEFAULT_PRENOM_PERSONNE)
            .gradePersonne(DEFAULT_GRADE_PERSONNE)
            .fonctionPersonne(DEFAULT_FONCTION_PERSONNE)
            .telphonePersonne(DEFAULT_TELPHONE_PERSONNE)
            .emailPersonne(DEFAULT_EMAIL_PERSONNE)
            .adressePersonne(DEFAULT_ADRESSE_PERSONNE)
            .dateDeNaissPersonne(DEFAULT_DATE_DE_NAISS_PERSONNE);
        return personnelSoignants;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PersonnelSoignants createUpdatedEntity(EntityManager em) {
        PersonnelSoignants personnelSoignants = new PersonnelSoignants()
            .codePersonne(UPDATED_CODE_PERSONNE)
            .nomPersonne(UPDATED_NOM_PERSONNE)
            .prenomPersonne(UPDATED_PRENOM_PERSONNE)
            .gradePersonne(UPDATED_GRADE_PERSONNE)
            .fonctionPersonne(UPDATED_FONCTION_PERSONNE)
            .telphonePersonne(UPDATED_TELPHONE_PERSONNE)
            .emailPersonne(UPDATED_EMAIL_PERSONNE)
            .adressePersonne(UPDATED_ADRESSE_PERSONNE)
            .dateDeNaissPersonne(UPDATED_DATE_DE_NAISS_PERSONNE);
        return personnelSoignants;
    }

    @BeforeEach
    public void initTest() {
        personnelSoignants = createEntity(em);
    }

    @Test
    @Transactional
    void createPersonnelSoignants() throws Exception {
        int databaseSizeBeforeCreate = personnelSoignantsRepository.findAll().size();
        // Create the PersonnelSoignants
        restPersonnelSoignantsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isCreated());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeCreate + 1);
        PersonnelSoignants testPersonnelSoignants = personnelSoignantsList.get(personnelSoignantsList.size() - 1);
        assertThat(testPersonnelSoignants.getCodePersonne()).isEqualTo(DEFAULT_CODE_PERSONNE);
        assertThat(testPersonnelSoignants.getNomPersonne()).isEqualTo(DEFAULT_NOM_PERSONNE);
        assertThat(testPersonnelSoignants.getPrenomPersonne()).isEqualTo(DEFAULT_PRENOM_PERSONNE);
        assertThat(testPersonnelSoignants.getGradePersonne()).isEqualTo(DEFAULT_GRADE_PERSONNE);
        assertThat(testPersonnelSoignants.getFonctionPersonne()).isEqualTo(DEFAULT_FONCTION_PERSONNE);
        assertThat(testPersonnelSoignants.getTelphonePersonne()).isEqualTo(DEFAULT_TELPHONE_PERSONNE);
        assertThat(testPersonnelSoignants.getEmailPersonne()).isEqualTo(DEFAULT_EMAIL_PERSONNE);
        assertThat(testPersonnelSoignants.getAdressePersonne()).isEqualTo(DEFAULT_ADRESSE_PERSONNE);
        assertThat(testPersonnelSoignants.getDateDeNaissPersonne()).isEqualTo(DEFAULT_DATE_DE_NAISS_PERSONNE);
    }

    @Test
    @Transactional
    void createPersonnelSoignantsWithExistingId() throws Exception {
        // Create the PersonnelSoignants with an existing ID
        personnelSoignants.setId(1L);

        int databaseSizeBeforeCreate = personnelSoignantsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPersonnelSoignantsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPersonnelSoignants() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        // Get all the personnelSoignantsList
        restPersonnelSoignantsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(personnelSoignants.getId().intValue())))
            .andExpect(jsonPath("$.[*].codePersonne").value(hasItem(DEFAULT_CODE_PERSONNE)))
            .andExpect(jsonPath("$.[*].nomPersonne").value(hasItem(DEFAULT_NOM_PERSONNE)))
            .andExpect(jsonPath("$.[*].prenomPersonne").value(hasItem(DEFAULT_PRENOM_PERSONNE)))
            .andExpect(jsonPath("$.[*].gradePersonne").value(hasItem(DEFAULT_GRADE_PERSONNE.toString())))
            .andExpect(jsonPath("$.[*].fonctionPersonne").value(hasItem(DEFAULT_FONCTION_PERSONNE)))
            .andExpect(jsonPath("$.[*].telphonePersonne").value(hasItem(DEFAULT_TELPHONE_PERSONNE)))
            .andExpect(jsonPath("$.[*].emailPersonne").value(hasItem(DEFAULT_EMAIL_PERSONNE.toString())))
            .andExpect(jsonPath("$.[*].adressePersonne").value(hasItem(DEFAULT_ADRESSE_PERSONNE)))
            .andExpect(jsonPath("$.[*].dateDeNaissPersonne").value(hasItem(sameInstant(DEFAULT_DATE_DE_NAISS_PERSONNE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPersonnelSoignantsWithEagerRelationshipsIsEnabled() throws Exception {
        when(personnelSoignantsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPersonnelSoignantsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(personnelSoignantsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPersonnelSoignantsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(personnelSoignantsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPersonnelSoignantsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(personnelSoignantsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getPersonnelSoignants() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        // Get the personnelSoignants
        restPersonnelSoignantsMockMvc
            .perform(get(ENTITY_API_URL_ID, personnelSoignants.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(personnelSoignants.getId().intValue()))
            .andExpect(jsonPath("$.codePersonne").value(DEFAULT_CODE_PERSONNE))
            .andExpect(jsonPath("$.nomPersonne").value(DEFAULT_NOM_PERSONNE))
            .andExpect(jsonPath("$.prenomPersonne").value(DEFAULT_PRENOM_PERSONNE))
            .andExpect(jsonPath("$.gradePersonne").value(DEFAULT_GRADE_PERSONNE.toString()))
            .andExpect(jsonPath("$.fonctionPersonne").value(DEFAULT_FONCTION_PERSONNE))
            .andExpect(jsonPath("$.telphonePersonne").value(DEFAULT_TELPHONE_PERSONNE))
            .andExpect(jsonPath("$.emailPersonne").value(DEFAULT_EMAIL_PERSONNE.toString()))
            .andExpect(jsonPath("$.adressePersonne").value(DEFAULT_ADRESSE_PERSONNE))
            .andExpect(jsonPath("$.dateDeNaissPersonne").value(sameInstant(DEFAULT_DATE_DE_NAISS_PERSONNE)));
    }

    @Test
    @Transactional
    void getNonExistingPersonnelSoignants() throws Exception {
        // Get the personnelSoignants
        restPersonnelSoignantsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPersonnelSoignants() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();

        // Update the personnelSoignants
        PersonnelSoignants updatedPersonnelSoignants = personnelSoignantsRepository.findById(personnelSoignants.getId()).get();
        // Disconnect from session so that the updates on updatedPersonnelSoignants are not directly saved in db
        em.detach(updatedPersonnelSoignants);
        updatedPersonnelSoignants
            .codePersonne(UPDATED_CODE_PERSONNE)
            .nomPersonne(UPDATED_NOM_PERSONNE)
            .prenomPersonne(UPDATED_PRENOM_PERSONNE)
            .gradePersonne(UPDATED_GRADE_PERSONNE)
            .fonctionPersonne(UPDATED_FONCTION_PERSONNE)
            .telphonePersonne(UPDATED_TELPHONE_PERSONNE)
            .emailPersonne(UPDATED_EMAIL_PERSONNE)
            .adressePersonne(UPDATED_ADRESSE_PERSONNE)
            .dateDeNaissPersonne(UPDATED_DATE_DE_NAISS_PERSONNE);

        restPersonnelSoignantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPersonnelSoignants.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPersonnelSoignants))
            )
            .andExpect(status().isOk());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
        PersonnelSoignants testPersonnelSoignants = personnelSoignantsList.get(personnelSoignantsList.size() - 1);
        assertThat(testPersonnelSoignants.getCodePersonne()).isEqualTo(UPDATED_CODE_PERSONNE);
        assertThat(testPersonnelSoignants.getNomPersonne()).isEqualTo(UPDATED_NOM_PERSONNE);
        assertThat(testPersonnelSoignants.getPrenomPersonne()).isEqualTo(UPDATED_PRENOM_PERSONNE);
        assertThat(testPersonnelSoignants.getGradePersonne()).isEqualTo(UPDATED_GRADE_PERSONNE);
        assertThat(testPersonnelSoignants.getFonctionPersonne()).isEqualTo(UPDATED_FONCTION_PERSONNE);
        assertThat(testPersonnelSoignants.getTelphonePersonne()).isEqualTo(UPDATED_TELPHONE_PERSONNE);
        assertThat(testPersonnelSoignants.getEmailPersonne()).isEqualTo(UPDATED_EMAIL_PERSONNE);
        assertThat(testPersonnelSoignants.getAdressePersonne()).isEqualTo(UPDATED_ADRESSE_PERSONNE);
        assertThat(testPersonnelSoignants.getDateDeNaissPersonne()).isEqualTo(UPDATED_DATE_DE_NAISS_PERSONNE);
    }

    @Test
    @Transactional
    void putNonExistingPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, personnelSoignants.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePersonnelSoignantsWithPatch() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();

        // Update the personnelSoignants using partial update
        PersonnelSoignants partialUpdatedPersonnelSoignants = new PersonnelSoignants();
        partialUpdatedPersonnelSoignants.setId(personnelSoignants.getId());

        partialUpdatedPersonnelSoignants
            .codePersonne(UPDATED_CODE_PERSONNE)
            .prenomPersonne(UPDATED_PRENOM_PERSONNE)
            .fonctionPersonne(UPDATED_FONCTION_PERSONNE)
            .telphonePersonne(UPDATED_TELPHONE_PERSONNE)
            .adressePersonne(UPDATED_ADRESSE_PERSONNE);

        restPersonnelSoignantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonnelSoignants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonnelSoignants))
            )
            .andExpect(status().isOk());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
        PersonnelSoignants testPersonnelSoignants = personnelSoignantsList.get(personnelSoignantsList.size() - 1);
        assertThat(testPersonnelSoignants.getCodePersonne()).isEqualTo(UPDATED_CODE_PERSONNE);
        assertThat(testPersonnelSoignants.getNomPersonne()).isEqualTo(DEFAULT_NOM_PERSONNE);
        assertThat(testPersonnelSoignants.getPrenomPersonne()).isEqualTo(UPDATED_PRENOM_PERSONNE);
        assertThat(testPersonnelSoignants.getGradePersonne()).isEqualTo(DEFAULT_GRADE_PERSONNE);
        assertThat(testPersonnelSoignants.getFonctionPersonne()).isEqualTo(UPDATED_FONCTION_PERSONNE);
        assertThat(testPersonnelSoignants.getTelphonePersonne()).isEqualTo(UPDATED_TELPHONE_PERSONNE);
        assertThat(testPersonnelSoignants.getEmailPersonne()).isEqualTo(DEFAULT_EMAIL_PERSONNE);
        assertThat(testPersonnelSoignants.getAdressePersonne()).isEqualTo(UPDATED_ADRESSE_PERSONNE);
        assertThat(testPersonnelSoignants.getDateDeNaissPersonne()).isEqualTo(DEFAULT_DATE_DE_NAISS_PERSONNE);
    }

    @Test
    @Transactional
    void fullUpdatePersonnelSoignantsWithPatch() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();

        // Update the personnelSoignants using partial update
        PersonnelSoignants partialUpdatedPersonnelSoignants = new PersonnelSoignants();
        partialUpdatedPersonnelSoignants.setId(personnelSoignants.getId());

        partialUpdatedPersonnelSoignants
            .codePersonne(UPDATED_CODE_PERSONNE)
            .nomPersonne(UPDATED_NOM_PERSONNE)
            .prenomPersonne(UPDATED_PRENOM_PERSONNE)
            .gradePersonne(UPDATED_GRADE_PERSONNE)
            .fonctionPersonne(UPDATED_FONCTION_PERSONNE)
            .telphonePersonne(UPDATED_TELPHONE_PERSONNE)
            .emailPersonne(UPDATED_EMAIL_PERSONNE)
            .adressePersonne(UPDATED_ADRESSE_PERSONNE)
            .dateDeNaissPersonne(UPDATED_DATE_DE_NAISS_PERSONNE);

        restPersonnelSoignantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPersonnelSoignants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPersonnelSoignants))
            )
            .andExpect(status().isOk());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
        PersonnelSoignants testPersonnelSoignants = personnelSoignantsList.get(personnelSoignantsList.size() - 1);
        assertThat(testPersonnelSoignants.getCodePersonne()).isEqualTo(UPDATED_CODE_PERSONNE);
        assertThat(testPersonnelSoignants.getNomPersonne()).isEqualTo(UPDATED_NOM_PERSONNE);
        assertThat(testPersonnelSoignants.getPrenomPersonne()).isEqualTo(UPDATED_PRENOM_PERSONNE);
        assertThat(testPersonnelSoignants.getGradePersonne()).isEqualTo(UPDATED_GRADE_PERSONNE);
        assertThat(testPersonnelSoignants.getFonctionPersonne()).isEqualTo(UPDATED_FONCTION_PERSONNE);
        assertThat(testPersonnelSoignants.getTelphonePersonne()).isEqualTo(UPDATED_TELPHONE_PERSONNE);
        assertThat(testPersonnelSoignants.getEmailPersonne()).isEqualTo(UPDATED_EMAIL_PERSONNE);
        assertThat(testPersonnelSoignants.getAdressePersonne()).isEqualTo(UPDATED_ADRESSE_PERSONNE);
        assertThat(testPersonnelSoignants.getDateDeNaissPersonne()).isEqualTo(UPDATED_DATE_DE_NAISS_PERSONNE);
    }

    @Test
    @Transactional
    void patchNonExistingPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, personnelSoignants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isBadRequest());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPersonnelSoignants() throws Exception {
        int databaseSizeBeforeUpdate = personnelSoignantsRepository.findAll().size();
        personnelSoignants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPersonnelSoignantsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(personnelSoignants))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PersonnelSoignants in the database
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePersonnelSoignants() throws Exception {
        // Initialize the database
        personnelSoignantsRepository.saveAndFlush(personnelSoignants);

        int databaseSizeBeforeDelete = personnelSoignantsRepository.findAll().size();

        // Delete the personnelSoignants
        restPersonnelSoignantsMockMvc
            .perform(delete(ENTITY_API_URL_ID, personnelSoignants.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PersonnelSoignants> personnelSoignantsList = personnelSoignantsRepository.findAll();
        assertThat(personnelSoignantsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
