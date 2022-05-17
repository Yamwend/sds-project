package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.LigneOrdonnances;
import com.mycompany.myapp.repository.LigneOrdonnancesRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.LigneOrdonnances}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LigneOrdonnancesResource {

    private final Logger log = LoggerFactory.getLogger(LigneOrdonnancesResource.class);

    private static final String ENTITY_NAME = "ligneOrdonnances";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LigneOrdonnancesRepository ligneOrdonnancesRepository;

    public LigneOrdonnancesResource(LigneOrdonnancesRepository ligneOrdonnancesRepository) {
        this.ligneOrdonnancesRepository = ligneOrdonnancesRepository;
    }

    /**
     * {@code POST  /ligne-ordonnances} : Create a new ligneOrdonnances.
     *
     * @param ligneOrdonnances the ligneOrdonnances to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ligneOrdonnances, or with status {@code 400 (Bad Request)} if the ligneOrdonnances has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ligne-ordonnances")
    public ResponseEntity<LigneOrdonnances> createLigneOrdonnances(@RequestBody LigneOrdonnances ligneOrdonnances)
        throws URISyntaxException {
        log.debug("REST request to save LigneOrdonnances : {}", ligneOrdonnances);
        if (ligneOrdonnances.getId() != null) {
            throw new BadRequestAlertException("A new ligneOrdonnances cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LigneOrdonnances result = ligneOrdonnancesRepository.save(ligneOrdonnances);
        return ResponseEntity
            .created(new URI("/api/ligne-ordonnances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ligne-ordonnances/:id} : Updates an existing ligneOrdonnances.
     *
     * @param id the id of the ligneOrdonnances to save.
     * @param ligneOrdonnances the ligneOrdonnances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ligneOrdonnances,
     * or with status {@code 400 (Bad Request)} if the ligneOrdonnances is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ligneOrdonnances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ligne-ordonnances/{id}")
    public ResponseEntity<LigneOrdonnances> updateLigneOrdonnances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LigneOrdonnances ligneOrdonnances
    ) throws URISyntaxException {
        log.debug("REST request to update LigneOrdonnances : {}, {}", id, ligneOrdonnances);
        if (ligneOrdonnances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ligneOrdonnances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ligneOrdonnancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LigneOrdonnances result = ligneOrdonnancesRepository.save(ligneOrdonnances);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ligneOrdonnances.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ligne-ordonnances/:id} : Partial updates given fields of an existing ligneOrdonnances, field will ignore if it is null
     *
     * @param id the id of the ligneOrdonnances to save.
     * @param ligneOrdonnances the ligneOrdonnances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ligneOrdonnances,
     * or with status {@code 400 (Bad Request)} if the ligneOrdonnances is not valid,
     * or with status {@code 404 (Not Found)} if the ligneOrdonnances is not found,
     * or with status {@code 500 (Internal Server Error)} if the ligneOrdonnances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ligne-ordonnances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LigneOrdonnances> partialUpdateLigneOrdonnances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LigneOrdonnances ligneOrdonnances
    ) throws URISyntaxException {
        log.debug("REST request to partial update LigneOrdonnances partially : {}, {}", id, ligneOrdonnances);
        if (ligneOrdonnances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ligneOrdonnances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ligneOrdonnancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LigneOrdonnances> result = ligneOrdonnancesRepository
            .findById(ligneOrdonnances.getId())
            .map(existingLigneOrdonnances -> {
                if (ligneOrdonnances.getMedicament() != null) {
                    existingLigneOrdonnances.setMedicament(ligneOrdonnances.getMedicament());
                }
                if (ligneOrdonnances.getPosologie() != null) {
                    existingLigneOrdonnances.setPosologie(ligneOrdonnances.getPosologie());
                }

                return existingLigneOrdonnances;
            })
            .map(ligneOrdonnancesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ligneOrdonnances.getId().toString())
        );
    }

    /**
     * {@code GET  /ligne-ordonnances} : get all the ligneOrdonnances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ligneOrdonnances in body.
     */
    @GetMapping("/ligne-ordonnances")
    public List<LigneOrdonnances> getAllLigneOrdonnances() {
        log.debug("REST request to get all LigneOrdonnances");
        return ligneOrdonnancesRepository.findAll();
    }

    /**
     * {@code GET  /ligne-ordonnances/:id} : get the "id" ligneOrdonnances.
     *
     * @param id the id of the ligneOrdonnances to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ligneOrdonnances, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ligne-ordonnances/{id}")
    public ResponseEntity<LigneOrdonnances> getLigneOrdonnances(@PathVariable Long id) {
        log.debug("REST request to get LigneOrdonnances : {}", id);
        Optional<LigneOrdonnances> ligneOrdonnances = ligneOrdonnancesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ligneOrdonnances);
    }

    /**
     * {@code DELETE  /ligne-ordonnances/:id} : delete the "id" ligneOrdonnances.
     *
     * @param id the id of the ligneOrdonnances to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ligne-ordonnances/{id}")
    public ResponseEntity<Void> deleteLigneOrdonnances(@PathVariable Long id) {
        log.debug("REST request to delete LigneOrdonnances : {}", id);
        ligneOrdonnancesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
