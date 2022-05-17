package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.FamilleMaladies;
import com.mycompany.myapp.repository.FamilleMaladiesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.FamilleMaladies}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FamilleMaladiesResource {

    private final Logger log = LoggerFactory.getLogger(FamilleMaladiesResource.class);

    private static final String ENTITY_NAME = "familleMaladies";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FamilleMaladiesRepository familleMaladiesRepository;

    public FamilleMaladiesResource(FamilleMaladiesRepository familleMaladiesRepository) {
        this.familleMaladiesRepository = familleMaladiesRepository;
    }

    /**
     * {@code POST  /famille-maladies} : Create a new familleMaladies.
     *
     * @param familleMaladies the familleMaladies to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new familleMaladies, or with status {@code 400 (Bad Request)} if the familleMaladies has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/famille-maladies")
    public ResponseEntity<FamilleMaladies> createFamilleMaladies(@RequestBody FamilleMaladies familleMaladies) throws URISyntaxException {
        log.debug("REST request to save FamilleMaladies : {}", familleMaladies);
        if (familleMaladies.getId() != null) {
            throw new BadRequestAlertException("A new familleMaladies cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FamilleMaladies result = familleMaladiesRepository.save(familleMaladies);
        return ResponseEntity
            .created(new URI("/api/famille-maladies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /famille-maladies/:id} : Updates an existing familleMaladies.
     *
     * @param id the id of the familleMaladies to save.
     * @param familleMaladies the familleMaladies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated familleMaladies,
     * or with status {@code 400 (Bad Request)} if the familleMaladies is not valid,
     * or with status {@code 500 (Internal Server Error)} if the familleMaladies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/famille-maladies/{id}")
    public ResponseEntity<FamilleMaladies> updateFamilleMaladies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FamilleMaladies familleMaladies
    ) throws URISyntaxException {
        log.debug("REST request to update FamilleMaladies : {}, {}", id, familleMaladies);
        if (familleMaladies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familleMaladies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familleMaladiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FamilleMaladies result = familleMaladiesRepository.save(familleMaladies);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familleMaladies.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /famille-maladies/:id} : Partial updates given fields of an existing familleMaladies, field will ignore if it is null
     *
     * @param id the id of the familleMaladies to save.
     * @param familleMaladies the familleMaladies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated familleMaladies,
     * or with status {@code 400 (Bad Request)} if the familleMaladies is not valid,
     * or with status {@code 404 (Not Found)} if the familleMaladies is not found,
     * or with status {@code 500 (Internal Server Error)} if the familleMaladies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/famille-maladies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FamilleMaladies> partialUpdateFamilleMaladies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FamilleMaladies familleMaladies
    ) throws URISyntaxException {
        log.debug("REST request to partial update FamilleMaladies partially : {}, {}", id, familleMaladies);
        if (familleMaladies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familleMaladies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familleMaladiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FamilleMaladies> result = familleMaladiesRepository
            .findById(familleMaladies.getId())
            .map(existingFamilleMaladies -> {
                if (familleMaladies.getLibelleFMaladie() != null) {
                    existingFamilleMaladies.setLibelleFMaladie(familleMaladies.getLibelleFMaladie());
                }
                if (familleMaladies.getDescriptionFMaladie() != null) {
                    existingFamilleMaladies.setDescriptionFMaladie(familleMaladies.getDescriptionFMaladie());
                }

                return existingFamilleMaladies;
            })
            .map(familleMaladiesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familleMaladies.getId().toString())
        );
    }

    /**
     * {@code GET  /famille-maladies} : get all the familleMaladies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of familleMaladies in body.
     */
    @GetMapping("/famille-maladies")
    public List<FamilleMaladies> getAllFamilleMaladies() {
        log.debug("REST request to get all FamilleMaladies");
        return familleMaladiesRepository.findAll();
    }

    /**
     * {@code GET  /famille-maladies/:id} : get the "id" familleMaladies.
     *
     * @param id the id of the familleMaladies to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the familleMaladies, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/famille-maladies/{id}")
    public ResponseEntity<FamilleMaladies> getFamilleMaladies(@PathVariable Long id) {
        log.debug("REST request to get FamilleMaladies : {}", id);
        Optional<FamilleMaladies> familleMaladies = familleMaladiesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(familleMaladies);
    }

    /**
     * {@code DELETE  /famille-maladies/:id} : delete the "id" familleMaladies.
     *
     * @param id the id of the familleMaladies to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/famille-maladies/{id}")
    public ResponseEntity<Void> deleteFamilleMaladies(@PathVariable Long id) {
        log.debug("REST request to delete FamilleMaladies : {}", id);
        familleMaladiesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
