package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.TypeExams;
import com.mycompany.myapp.repository.TypeExamsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.TypeExams}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TypeExamsResource {

    private final Logger log = LoggerFactory.getLogger(TypeExamsResource.class);

    private static final String ENTITY_NAME = "typeExams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TypeExamsRepository typeExamsRepository;

    public TypeExamsResource(TypeExamsRepository typeExamsRepository) {
        this.typeExamsRepository = typeExamsRepository;
    }

    /**
     * {@code POST  /type-exams} : Create a new typeExams.
     *
     * @param typeExams the typeExams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new typeExams, or with status {@code 400 (Bad Request)} if the typeExams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/type-exams")
    public ResponseEntity<TypeExams> createTypeExams(@RequestBody TypeExams typeExams) throws URISyntaxException {
        log.debug("REST request to save TypeExams : {}", typeExams);
        if (typeExams.getId() != null) {
            throw new BadRequestAlertException("A new typeExams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TypeExams result = typeExamsRepository.save(typeExams);
        return ResponseEntity
            .created(new URI("/api/type-exams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /type-exams/:id} : Updates an existing typeExams.
     *
     * @param id the id of the typeExams to save.
     * @param typeExams the typeExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeExams,
     * or with status {@code 400 (Bad Request)} if the typeExams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the typeExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/type-exams/{id}")
    public ResponseEntity<TypeExams> updateTypeExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeExams typeExams
    ) throws URISyntaxException {
        log.debug("REST request to update TypeExams : {}, {}", id, typeExams);
        if (typeExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TypeExams result = typeExamsRepository.save(typeExams);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeExams.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /type-exams/:id} : Partial updates given fields of an existing typeExams, field will ignore if it is null
     *
     * @param id the id of the typeExams to save.
     * @param typeExams the typeExams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated typeExams,
     * or with status {@code 400 (Bad Request)} if the typeExams is not valid,
     * or with status {@code 404 (Not Found)} if the typeExams is not found,
     * or with status {@code 500 (Internal Server Error)} if the typeExams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/type-exams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TypeExams> partialUpdateTypeExams(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TypeExams typeExams
    ) throws URISyntaxException {
        log.debug("REST request to partial update TypeExams partially : {}, {}", id, typeExams);
        if (typeExams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, typeExams.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!typeExamsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TypeExams> result = typeExamsRepository
            .findById(typeExams.getId())
            .map(existingTypeExams -> {
                if (typeExams.getLibelleType() != null) {
                    existingTypeExams.setLibelleType(typeExams.getLibelleType());
                }
                if (typeExams.getDescruptionType() != null) {
                    existingTypeExams.setDescruptionType(typeExams.getDescruptionType());
                }

                return existingTypeExams;
            })
            .map(typeExamsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, typeExams.getId().toString())
        );
    }

    /**
     * {@code GET  /type-exams} : get all the typeExams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of typeExams in body.
     */
    @GetMapping("/type-exams")
    public List<TypeExams> getAllTypeExams() {
        log.debug("REST request to get all TypeExams");
        return typeExamsRepository.findAll();
    }

    /**
     * {@code GET  /type-exams/:id} : get the "id" typeExams.
     *
     * @param id the id of the typeExams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the typeExams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/type-exams/{id}")
    public ResponseEntity<TypeExams> getTypeExams(@PathVariable Long id) {
        log.debug("REST request to get TypeExams : {}", id);
        Optional<TypeExams> typeExams = typeExamsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(typeExams);
    }

    /**
     * {@code DELETE  /type-exams/:id} : delete the "id" typeExams.
     *
     * @param id the id of the typeExams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/type-exams/{id}")
    public ResponseEntity<Void> deleteTypeExams(@PathVariable Long id) {
        log.debug("REST request to delete TypeExams : {}", id);
        typeExamsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
