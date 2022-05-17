package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Laboratoires;
import com.mycompany.myapp.repository.LaboratoiresRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Laboratoires}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LaboratoiresResource {

    private final Logger log = LoggerFactory.getLogger(LaboratoiresResource.class);

    private static final String ENTITY_NAME = "laboratoires";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LaboratoiresRepository laboratoiresRepository;

    public LaboratoiresResource(LaboratoiresRepository laboratoiresRepository) {
        this.laboratoiresRepository = laboratoiresRepository;
    }

    /**
     * {@code POST  /laboratoires} : Create a new laboratoires.
     *
     * @param laboratoires the laboratoires to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new laboratoires, or with status {@code 400 (Bad Request)} if the laboratoires has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/laboratoires")
    public ResponseEntity<Laboratoires> createLaboratoires(@RequestBody Laboratoires laboratoires) throws URISyntaxException {
        log.debug("REST request to save Laboratoires : {}", laboratoires);
        if (laboratoires.getId() != null) {
            throw new BadRequestAlertException("A new laboratoires cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Laboratoires result = laboratoiresRepository.save(laboratoires);
        return ResponseEntity
            .created(new URI("/api/laboratoires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /laboratoires/:id} : Updates an existing laboratoires.
     *
     * @param id the id of the laboratoires to save.
     * @param laboratoires the laboratoires to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoires,
     * or with status {@code 400 (Bad Request)} if the laboratoires is not valid,
     * or with status {@code 500 (Internal Server Error)} if the laboratoires couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/laboratoires/{id}")
    public ResponseEntity<Laboratoires> updateLaboratoires(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Laboratoires laboratoires
    ) throws URISyntaxException {
        log.debug("REST request to update Laboratoires : {}, {}", id, laboratoires);
        if (laboratoires.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laboratoires.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoiresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Laboratoires result = laboratoiresRepository.save(laboratoires);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laboratoires.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /laboratoires/:id} : Partial updates given fields of an existing laboratoires, field will ignore if it is null
     *
     * @param id the id of the laboratoires to save.
     * @param laboratoires the laboratoires to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laboratoires,
     * or with status {@code 400 (Bad Request)} if the laboratoires is not valid,
     * or with status {@code 404 (Not Found)} if the laboratoires is not found,
     * or with status {@code 500 (Internal Server Error)} if the laboratoires couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/laboratoires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Laboratoires> partialUpdateLaboratoires(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Laboratoires laboratoires
    ) throws URISyntaxException {
        log.debug("REST request to partial update Laboratoires partially : {}, {}", id, laboratoires);
        if (laboratoires.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laboratoires.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laboratoiresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Laboratoires> result = laboratoiresRepository
            .findById(laboratoires.getId())
            .map(existingLaboratoires -> {
                if (laboratoires.getNomLaboratoire() != null) {
                    existingLaboratoires.setNomLaboratoire(laboratoires.getNomLaboratoire());
                }
                if (laboratoires.getObservationsExamens() != null) {
                    existingLaboratoires.setObservationsExamens(laboratoires.getObservationsExamens());
                }

                return existingLaboratoires;
            })
            .map(laboratoiresRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laboratoires.getId().toString())
        );
    }

    /**
     * {@code GET  /laboratoires} : get all the laboratoires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of laboratoires in body.
     */
    @GetMapping("/laboratoires")
    public List<Laboratoires> getAllLaboratoires() {
        log.debug("REST request to get all Laboratoires");
        return laboratoiresRepository.findAll();
    }

    /**
     * {@code GET  /laboratoires/:id} : get the "id" laboratoires.
     *
     * @param id the id of the laboratoires to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the laboratoires, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/laboratoires/{id}")
    public ResponseEntity<Laboratoires> getLaboratoires(@PathVariable Long id) {
        log.debug("REST request to get Laboratoires : {}", id);
        Optional<Laboratoires> laboratoires = laboratoiresRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(laboratoires);
    }

    /**
     * {@code DELETE  /laboratoires/:id} : delete the "id" laboratoires.
     *
     * @param id the id of the laboratoires to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/laboratoires/{id}")
    public ResponseEntity<Void> deleteLaboratoires(@PathVariable Long id) {
        log.debug("REST request to delete Laboratoires : {}", id);
        laboratoiresRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
