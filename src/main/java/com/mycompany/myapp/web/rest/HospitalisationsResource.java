package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Hospitalisations;
import com.mycompany.myapp.repository.HospitalisationsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Hospitalisations}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HospitalisationsResource {

    private final Logger log = LoggerFactory.getLogger(HospitalisationsResource.class);

    private static final String ENTITY_NAME = "hospitalisations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HospitalisationsRepository hospitalisationsRepository;

    public HospitalisationsResource(HospitalisationsRepository hospitalisationsRepository) {
        this.hospitalisationsRepository = hospitalisationsRepository;
    }

    /**
     * {@code POST  /hospitalisations} : Create a new hospitalisations.
     *
     * @param hospitalisations the hospitalisations to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hospitalisations, or with status {@code 400 (Bad Request)} if the hospitalisations has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hospitalisations")
    public ResponseEntity<Hospitalisations> createHospitalisations(@RequestBody Hospitalisations hospitalisations)
        throws URISyntaxException {
        log.debug("REST request to save Hospitalisations : {}", hospitalisations);
        if (hospitalisations.getId() != null) {
            throw new BadRequestAlertException("A new hospitalisations cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Hospitalisations result = hospitalisationsRepository.save(hospitalisations);
        return ResponseEntity
            .created(new URI("/api/hospitalisations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /hospitalisations/:id} : Updates an existing hospitalisations.
     *
     * @param id the id of the hospitalisations to save.
     * @param hospitalisations the hospitalisations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hospitalisations,
     * or with status {@code 400 (Bad Request)} if the hospitalisations is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hospitalisations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hospitalisations/{id}")
    public ResponseEntity<Hospitalisations> updateHospitalisations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Hospitalisations hospitalisations
    ) throws URISyntaxException {
        log.debug("REST request to update Hospitalisations : {}, {}", id, hospitalisations);
        if (hospitalisations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hospitalisations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hospitalisationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Hospitalisations result = hospitalisationsRepository.save(hospitalisations);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hospitalisations.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /hospitalisations/:id} : Partial updates given fields of an existing hospitalisations, field will ignore if it is null
     *
     * @param id the id of the hospitalisations to save.
     * @param hospitalisations the hospitalisations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hospitalisations,
     * or with status {@code 400 (Bad Request)} if the hospitalisations is not valid,
     * or with status {@code 404 (Not Found)} if the hospitalisations is not found,
     * or with status {@code 500 (Internal Server Error)} if the hospitalisations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hospitalisations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Hospitalisations> partialUpdateHospitalisations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Hospitalisations hospitalisations
    ) throws URISyntaxException {
        log.debug("REST request to partial update Hospitalisations partially : {}, {}", id, hospitalisations);
        if (hospitalisations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hospitalisations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hospitalisationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Hospitalisations> result = hospitalisationsRepository
            .findById(hospitalisations.getId())
            .map(existingHospitalisations -> {
                if (hospitalisations.getDateArrivee() != null) {
                    existingHospitalisations.setDateArrivee(hospitalisations.getDateArrivee());
                }
                if (hospitalisations.getDateSortie() != null) {
                    existingHospitalisations.setDateSortie(hospitalisations.getDateSortie());
                }
                if (hospitalisations.getObservationsHospitalisation() != null) {
                    existingHospitalisations.setObservationsHospitalisation(hospitalisations.getObservationsHospitalisation());
                }

                return existingHospitalisations;
            })
            .map(hospitalisationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hospitalisations.getId().toString())
        );
    }

    /**
     * {@code GET  /hospitalisations} : get all the hospitalisations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hospitalisations in body.
     */
    @GetMapping("/hospitalisations")
    public List<Hospitalisations> getAllHospitalisations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Hospitalisations");
        return hospitalisationsRepository.findAllWithEagerRelationships();
    }

    @GetMapping("/hospitalisations/ByPatienId")
    public List<Hospitalisations> getAllHospitalisationsByPatient(@RequestParam(required = true) Long patientId) {
        log.debug("REST request to get all Hospitalisations");
        return hospitalisationsRepository
            .findAll()
            .stream()
            .filter(h -> h.getPatient().getId().equals(patientId))
            .collect(Collectors.toList());
    }

    /**
     * {@code GET  /hospitalisations/:id} : get the "id" hospitalisations.
     *
     * @param id the id of the hospitalisations to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hospitalisations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hospitalisations/{id}")
    public ResponseEntity<Hospitalisations> getHospitalisations(@PathVariable Long id) {
        log.debug("REST request to get Hospitalisations : {}", id);
        Optional<Hospitalisations> hospitalisations = hospitalisationsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(hospitalisations);
    }

    /**
     * {@code DELETE  /hospitalisations/:id} : delete the "id" hospitalisations.
     *
     * @param id the id of the hospitalisations to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hospitalisations/{id}")
    public ResponseEntity<Void> deleteHospitalisations(@PathVariable Long id) {
        log.debug("REST request to delete Hospitalisations : {}", id);
        hospitalisationsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
