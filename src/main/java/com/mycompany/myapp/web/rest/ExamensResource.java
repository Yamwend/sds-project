package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Examens;
import com.mycompany.myapp.repository.ExamensRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Examens}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExamensResource {

    private final Logger log = LoggerFactory.getLogger(ExamensResource.class);

    private static final String ENTITY_NAME = "examens";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamensRepository examensRepository;

    public ExamensResource(ExamensRepository examensRepository) {
        this.examensRepository = examensRepository;
    }

    /**
     * {@code POST  /examens} : Create a new examens.
     *
     * @param examens the examens to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new examens, or with status {@code 400 (Bad Request)} if the examens has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/examens")
    public ResponseEntity<Examens> createExamens(@RequestBody Examens examens) throws URISyntaxException {
        log.debug("REST request to save Examens : {}", examens);
        if (examens.getId() != null) {
            throw new BadRequestAlertException("A new examens cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Examens result = examensRepository.save(examens);
        return ResponseEntity
            .created(new URI("/api/examens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /examens/:id} : Updates an existing examens.
     *
     * @param id the id of the examens to save.
     * @param examens the examens to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examens,
     * or with status {@code 400 (Bad Request)} if the examens is not valid,
     * or with status {@code 500 (Internal Server Error)} if the examens couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/examens/{id}")
    public ResponseEntity<Examens> updateExamens(@PathVariable(value = "id", required = false) final Long id, @RequestBody Examens examens)
        throws URISyntaxException {
        log.debug("REST request to update Examens : {}, {}", id, examens);
        if (examens.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examens.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examensRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Examens result = examensRepository.save(examens);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examens.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /examens/:id} : Partial updates given fields of an existing examens, field will ignore if it is null
     *
     * @param id the id of the examens to save.
     * @param examens the examens to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examens,
     * or with status {@code 400 (Bad Request)} if the examens is not valid,
     * or with status {@code 404 (Not Found)} if the examens is not found,
     * or with status {@code 500 (Internal Server Error)} if the examens couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/examens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Examens> partialUpdateExamens(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Examens examens
    ) throws URISyntaxException {
        log.debug("REST request to partial update Examens partially : {}, {}", id, examens);
        if (examens.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, examens.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!examensRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Examens> result = examensRepository
            .findById(examens.getId())
            .map(existingExamens -> {
                if (examens.getNomExamen() != null) {
                    existingExamens.setNomExamen(examens.getNomExamen());
                }
                if (examens.getTypeExamen() != null) {
                    existingExamens.setTypeExamen(examens.getTypeExamen());
                }
                if (examens.getDateExamen() != null) {
                    existingExamens.setDateExamen(examens.getDateExamen());
                }

                return existingExamens;
            })
            .map(examensRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examens.getId().toString())
        );
    }

    /**
     * {@code GET  /examens} : get all the examens.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of examens in body.
     */
    @GetMapping("/examens")
    public List<Examens> getAllExamens(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Examens");
        return examensRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /examens/:id} : get the "id" examens.
     *
     * @param id the id of the examens to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the examens, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/examens/{id}")
    public ResponseEntity<Examens> getExamens(@PathVariable Long id) {
        log.debug("REST request to get Examens : {}", id);
        Optional<Examens> examens = examensRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(examens);
    }

    /**
     * {@code DELETE  /examens/:id} : delete the "id" examens.
     *
     * @param id the id of the examens to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/examens/{id}")
    public ResponseEntity<Void> deleteExamens(@PathVariable Long id) {
        log.debug("REST request to delete Examens : {}", id);
        examensRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
