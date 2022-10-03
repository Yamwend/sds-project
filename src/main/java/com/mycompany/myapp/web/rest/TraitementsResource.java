package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Traitements;
import com.mycompany.myapp.repository.TraitementsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import liquibase.pro.packaged.id;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Traitements}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TraitementsResource {

    private final Logger log = LoggerFactory.getLogger(TraitementsResource.class);

    private static final String ENTITY_NAME = "traitements";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TraitementsRepository traitementsRepository;

    public TraitementsResource(TraitementsRepository traitementsRepository) {
        this.traitementsRepository = traitementsRepository;
    }

    /**
     * {@code POST  /traitements} : Create a new traitements.
     *
     * @param traitements the traitements to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new traitements, or with status {@code 400 (Bad Request)} if the traitements has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/traitements")
    public ResponseEntity<Traitements> createTraitements(@RequestBody Traitements traitements) throws URISyntaxException {
        log.debug("REST request to save Traitements : {}", traitements);
        if (traitements.getId() != null) {
            throw new BadRequestAlertException("A new traitements cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Traitements result = traitementsRepository.save(traitements);
        return ResponseEntity
            .created(new URI("/api/traitements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /traitements/:id} : Updates an existing traitements.
     *
     * @param id the id of the traitements to save.
     * @param traitements the traitements to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated traitements,
     * or with status {@code 400 (Bad Request)} if the traitements is not valid,
     * or with status {@code 500 (Internal Server Error)} if the traitements couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/traitements/{id}")
    public ResponseEntity<Traitements> updateTraitements(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Traitements traitements
    ) throws URISyntaxException {
        log.debug("REST request to update Traitements : {}, {}", id, traitements);
        if (traitements.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, traitements.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traitementsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Traitements result = traitementsRepository.save(traitements);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, traitements.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /traitements/:id} : Partial updates given fields of an existing traitements, field will ignore if it is null
     *
     * @param id the id of the traitements to save.
     * @param traitements the traitements to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated traitements,
     * or with status {@code 400 (Bad Request)} if the traitements is not valid,
     * or with status {@code 404 (Not Found)} if the traitements is not found,
     * or with status {@code 500 (Internal Server Error)} if the traitements couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/traitements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Traitements> partialUpdateTraitements(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Traitements traitements
    ) throws URISyntaxException {
        log.debug("REST request to partial update Traitements partially : {}, {}", id, traitements);
        if (traitements.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, traitements.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!traitementsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Traitements> result = traitementsRepository
            .findById(traitements.getId())
            .map(existingTraitements -> {
                if (traitements.getObservationsTraitement() != null) {
                    existingTraitements.setObservationsTraitement(traitements.getObservationsTraitement());
                }
                if (traitements.getDebutTraitement() != null) {
                    existingTraitements.setDebutTraitement(traitements.getDebutTraitement());
                }
                if (traitements.getFinTraitement() != null) {
                    existingTraitements.setFinTraitement(traitements.getFinTraitement());
                }
                if (traitements.getEtatFinPatient() != null) {
                    existingTraitements.setEtatFinPatient(traitements.getEtatFinPatient());
                }

                return existingTraitements;
            })
            .map(traitementsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, traitements.getId().toString())
        );
    }

    /**
     * {@code GET  /traitements} : get all the traitements.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of traitements in body.
     */
    @GetMapping("/traitements")
    public List<Traitements> getAllTraitements(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Traitements");
        return traitementsRepository.findAllWithEagerRelationships();
    }

    @GetMapping("/traitements/ByPatientId")
    public List<Traitements> getAllTraitementsByPatient(@RequestParam(required = true) Long patientId) {
        System.out.print(patientId);
        System.out.print("\n");
        log.debug("REST request to get all Traitements of patient xx");
        return traitementsRepository.findAll().stream().filter(t -> t.getPatient().getId().equals(patientId)).collect(Collectors.toList());
        // .stream().filter(traitement -> traitement.getPatient().getId().equals(id)).collect(Collectors.toList());
    }

    /**
     * {@code GET  /traitements/:id} : get the "id" traitements.
     *
     * @param id the id of the traitements to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the traitements, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/traitements/{id}")
    public ResponseEntity<Traitements> getTraitements(@PathVariable Long id) {
        log.debug("REST request to get Traitements : {}", id);
        Optional<Traitements> traitements = traitementsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(traitements);
    }

    /**
     * {@code DELETE  /traitements/:id} : delete the "id" traitements.
     *
     * @param id the id of the traitements to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/traitements/{id}")
    public ResponseEntity<Void> deleteTraitements(@PathVariable Long id) {
        log.debug("REST request to delete Traitements : {}", id);
        traitementsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
