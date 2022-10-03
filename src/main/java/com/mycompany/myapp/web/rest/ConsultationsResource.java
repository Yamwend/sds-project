package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Consultations;
import com.mycompany.myapp.repository.ConsultationsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Consultations}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConsultationsResource {

    private final Logger log = LoggerFactory.getLogger(ConsultationsResource.class);

    private static final String ENTITY_NAME = "consultations";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsultationsRepository consultationsRepository;

    public ConsultationsResource(ConsultationsRepository consultationsRepository) {
        this.consultationsRepository = consultationsRepository;
    }

    /**
     * {@code POST  /consultations} : Create a new consultations.
     *
     * @param consultations the consultations to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consultations, or with status {@code 400 (Bad Request)} if the consultations has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consultations")
    public ResponseEntity<Consultations> createConsultations(@RequestBody Consultations consultations) throws URISyntaxException {
        log.debug("REST request to save Consultations : {}", consultations);
        if (consultations.getId() != null) {
            throw new BadRequestAlertException("A new consultations cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consultations result = consultationsRepository.save(consultations);
        return ResponseEntity
            .created(new URI("/api/consultations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consultations/:id} : Updates an existing consultations.
     *
     * @param id the id of the consultations to save.
     * @param consultations the consultations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultations,
     * or with status {@code 400 (Bad Request)} if the consultations is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consultations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consultations/{id}")
    public ResponseEntity<Consultations> updateConsultations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consultations consultations
    ) throws URISyntaxException {
        log.debug("REST request to update Consultations : {}, {}", id, consultations);
        if (consultations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consultations result = consultationsRepository.save(consultations);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultations.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consultations/:id} : Partial updates given fields of an existing consultations, field will ignore if it is null
     *
     * @param id the id of the consultations to save.
     * @param consultations the consultations to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consultations,
     * or with status {@code 400 (Bad Request)} if the consultations is not valid,
     * or with status {@code 404 (Not Found)} if the consultations is not found,
     * or with status {@code 500 (Internal Server Error)} if the consultations couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consultations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Consultations> partialUpdateConsultations(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consultations consultations
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consultations partially : {}, {}", id, consultations);
        if (consultations.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consultations.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultationsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consultations> result = consultationsRepository
            .findById(consultations.getId())
            .map(existingConsultations -> {
                if (consultations.getTypeConsultation() != null) {
                    existingConsultations.setTypeConsultation(consultations.getTypeConsultation());
                }
                if (consultations.getObservationsConsltation() != null) {
                    existingConsultations.setObservationsConsltation(consultations.getObservationsConsltation());
                }
                if (consultations.getFraisConsultion() != null) {
                    existingConsultations.setFraisConsultion(consultations.getFraisConsultion());
                }
                if (consultations.getDateConsultion() != null) {
                    existingConsultations.setDateConsultion(consultations.getDateConsultion());
                }

                return existingConsultations;
            })
            .map(consultationsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consultations.getId().toString())
        );
    }

    /**
     * {@code GET  /consultations} : get all the consultations.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consultations in body.
     */
    @GetMapping("/consultations")
    public List<Consultations> getAllConsultations(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Consultations");
        return consultationsRepository.findAllWithEagerRelationships();
    }

    @GetMapping("/consultations/ByPatientId")
    public List<Consultations> getAllConsultationsByPatient(@RequestParam(required = true) Long patiendId) {
        return consultationsRepository
            .findAll()
            .stream()
            .filter(c -> c.getPatient().getId().equals(patiendId))
            .collect(Collectors.toList());
    }

    /**
     * {@code GET  /consultations/:id} : get the "id" consultations.
     *
     * @param id the id of the consultations to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consultations, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consultations/{id}")
    public ResponseEntity<Consultations> getConsultations(@PathVariable Long id) {
        log.debug("REST request to get Consultations : {}", id);
        Optional<Consultations> consultations = consultationsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(consultations);
    }

    /**
     * {@code DELETE  /consultations/:id} : delete the "id" consultations.
     *
     * @param id the id of the consultations to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consultations/{id}")
    public ResponseEntity<Void> deleteConsultations(@PathVariable Long id) {
        log.debug("REST request to delete Consultations : {}", id);
        consultationsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
