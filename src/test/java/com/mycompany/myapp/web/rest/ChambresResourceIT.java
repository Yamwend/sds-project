package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Chambres;
import com.mycompany.myapp.repository.ChambresRepository;
import java.math.BigDecimal;
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
 * Integration tests for the {@link ChambresResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ChambresResourceIT {

    private static final String DEFAULT_NUMERO_CHAMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_CHAMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_LOCALISATION_CHAMBRE = "AAAAAAAAAA";
    private static final String UPDATED_LOCALISATION_CHAMBRE = "BBBBBBBBBB";

    private static final Integer DEFAULT_NOMBREB_LIT = 1;
    private static final Integer UPDATED_NOMBREB_LIT = 2;

    private static final BigDecimal DEFAULT_PRIX_CHAMBRE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRIX_CHAMBRE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/chambres";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChambresRepository chambresRepository;

    @Mock
    private ChambresRepository chambresRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChambresMockMvc;

    private Chambres chambres;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chambres createEntity(EntityManager em) {
        Chambres chambres = new Chambres()
            .numeroChambre(DEFAULT_NUMERO_CHAMBRE)
            .localisationChambre(DEFAULT_LOCALISATION_CHAMBRE)
            .nombrebLit(DEFAULT_NOMBREB_LIT)
            .prixChambre(DEFAULT_PRIX_CHAMBRE);
        return chambres;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chambres createUpdatedEntity(EntityManager em) {
        Chambres chambres = new Chambres()
            .numeroChambre(UPDATED_NUMERO_CHAMBRE)
            .localisationChambre(UPDATED_LOCALISATION_CHAMBRE)
            .nombrebLit(UPDATED_NOMBREB_LIT)
            .prixChambre(UPDATED_PRIX_CHAMBRE);
        return chambres;
    }

    @BeforeEach
    public void initTest() {
        chambres = createEntity(em);
    }

    @Test
    @Transactional
    void createChambres() throws Exception {
        int databaseSizeBeforeCreate = chambresRepository.findAll().size();
        // Create the Chambres
        restChambresMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambres)))
            .andExpect(status().isCreated());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeCreate + 1);
        Chambres testChambres = chambresList.get(chambresList.size() - 1);
        assertThat(testChambres.getNumeroChambre()).isEqualTo(DEFAULT_NUMERO_CHAMBRE);
        assertThat(testChambres.getLocalisationChambre()).isEqualTo(DEFAULT_LOCALISATION_CHAMBRE);
        assertThat(testChambres.getNombrebLit()).isEqualTo(DEFAULT_NOMBREB_LIT);
        assertThat(testChambres.getPrixChambre()).isEqualByComparingTo(DEFAULT_PRIX_CHAMBRE);
    }

    @Test
    @Transactional
    void createChambresWithExistingId() throws Exception {
        // Create the Chambres with an existing ID
        chambres.setId(1L);

        int databaseSizeBeforeCreate = chambresRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChambresMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambres)))
            .andExpect(status().isBadRequest());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChambres() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        // Get all the chambresList
        restChambresMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chambres.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroChambre").value(hasItem(DEFAULT_NUMERO_CHAMBRE)))
            .andExpect(jsonPath("$.[*].localisationChambre").value(hasItem(DEFAULT_LOCALISATION_CHAMBRE)))
            .andExpect(jsonPath("$.[*].nombrebLit").value(hasItem(DEFAULT_NOMBREB_LIT)))
            .andExpect(jsonPath("$.[*].prixChambre").value(hasItem(sameNumber(DEFAULT_PRIX_CHAMBRE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChambresWithEagerRelationshipsIsEnabled() throws Exception {
        when(chambresRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChambresMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(chambresRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllChambresWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(chambresRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restChambresMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(chambresRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getChambres() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        // Get the chambres
        restChambresMockMvc
            .perform(get(ENTITY_API_URL_ID, chambres.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chambres.getId().intValue()))
            .andExpect(jsonPath("$.numeroChambre").value(DEFAULT_NUMERO_CHAMBRE))
            .andExpect(jsonPath("$.localisationChambre").value(DEFAULT_LOCALISATION_CHAMBRE))
            .andExpect(jsonPath("$.nombrebLit").value(DEFAULT_NOMBREB_LIT))
            .andExpect(jsonPath("$.prixChambre").value(sameNumber(DEFAULT_PRIX_CHAMBRE)));
    }

    @Test
    @Transactional
    void getNonExistingChambres() throws Exception {
        // Get the chambres
        restChambresMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChambres() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();

        // Update the chambres
        Chambres updatedChambres = chambresRepository.findById(chambres.getId()).get();
        // Disconnect from session so that the updates on updatedChambres are not directly saved in db
        em.detach(updatedChambres);
        updatedChambres
            .numeroChambre(UPDATED_NUMERO_CHAMBRE)
            .localisationChambre(UPDATED_LOCALISATION_CHAMBRE)
            .nombrebLit(UPDATED_NOMBREB_LIT)
            .prixChambre(UPDATED_PRIX_CHAMBRE);

        restChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChambres.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChambres))
            )
            .andExpect(status().isOk());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
        Chambres testChambres = chambresList.get(chambresList.size() - 1);
        assertThat(testChambres.getNumeroChambre()).isEqualTo(UPDATED_NUMERO_CHAMBRE);
        assertThat(testChambres.getLocalisationChambre()).isEqualTo(UPDATED_LOCALISATION_CHAMBRE);
        assertThat(testChambres.getNombrebLit()).isEqualTo(UPDATED_NOMBREB_LIT);
        assertThat(testChambres.getPrixChambre()).isEqualByComparingTo(UPDATED_PRIX_CHAMBRE);
    }

    @Test
    @Transactional
    void putNonExistingChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chambres.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chambres)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChambresWithPatch() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();

        // Update the chambres using partial update
        Chambres partialUpdatedChambres = new Chambres();
        partialUpdatedChambres.setId(chambres.getId());

        partialUpdatedChambres.nombrebLit(UPDATED_NOMBREB_LIT);

        restChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChambres))
            )
            .andExpect(status().isOk());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
        Chambres testChambres = chambresList.get(chambresList.size() - 1);
        assertThat(testChambres.getNumeroChambre()).isEqualTo(DEFAULT_NUMERO_CHAMBRE);
        assertThat(testChambres.getLocalisationChambre()).isEqualTo(DEFAULT_LOCALISATION_CHAMBRE);
        assertThat(testChambres.getNombrebLit()).isEqualTo(UPDATED_NOMBREB_LIT);
        assertThat(testChambres.getPrixChambre()).isEqualByComparingTo(DEFAULT_PRIX_CHAMBRE);
    }

    @Test
    @Transactional
    void fullUpdateChambresWithPatch() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();

        // Update the chambres using partial update
        Chambres partialUpdatedChambres = new Chambres();
        partialUpdatedChambres.setId(chambres.getId());

        partialUpdatedChambres
            .numeroChambre(UPDATED_NUMERO_CHAMBRE)
            .localisationChambre(UPDATED_LOCALISATION_CHAMBRE)
            .nombrebLit(UPDATED_NOMBREB_LIT)
            .prixChambre(UPDATED_PRIX_CHAMBRE);

        restChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChambres))
            )
            .andExpect(status().isOk());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
        Chambres testChambres = chambresList.get(chambresList.size() - 1);
        assertThat(testChambres.getNumeroChambre()).isEqualTo(UPDATED_NUMERO_CHAMBRE);
        assertThat(testChambres.getLocalisationChambre()).isEqualTo(UPDATED_LOCALISATION_CHAMBRE);
        assertThat(testChambres.getNombrebLit()).isEqualTo(UPDATED_NOMBREB_LIT);
        assertThat(testChambres.getPrixChambre()).isEqualByComparingTo(UPDATED_PRIX_CHAMBRE);
    }

    @Test
    @Transactional
    void patchNonExistingChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chambres.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chambres))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChambres() throws Exception {
        int databaseSizeBeforeUpdate = chambresRepository.findAll().size();
        chambres.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChambresMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chambres)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chambres in the database
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChambres() throws Exception {
        // Initialize the database
        chambresRepository.saveAndFlush(chambres);

        int databaseSizeBeforeDelete = chambresRepository.findAll().size();

        // Delete the chambres
        restChambresMockMvc
            .perform(delete(ENTITY_API_URL_ID, chambres.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chambres> chambresList = chambresRepository.findAll();
        assertThat(chambresList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
