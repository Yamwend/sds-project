package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Maladies;
import com.mycompany.myapp.repository.MaladiesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Maladies}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MaladiesResource {

    private final Logger log = LoggerFactory.getLogger(MaladiesResource.class);

    private static final String ENTITY_NAME = "maladies";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MaladiesRepository maladiesRepository;

    public MaladiesResource(MaladiesRepository maladiesRepository) {
        this.maladiesRepository = maladiesRepository;
    }

    /**
     * {@code POST  /maladies} : Create a new maladies.
     *
     * @param maladies the maladies to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new maladies, or with status {@code 400 (Bad Request)} if the maladies has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/maladies")
    public ResponseEntity<Maladies> createMaladies(@RequestBody Maladies maladies) throws URISyntaxException {
        log.debug("REST request to save Maladies : {}", maladies);
        if (maladies.getId() != null) {
            throw new BadRequestAlertException("A new maladies cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Maladies result = maladiesRepository.save(maladies);
        return ResponseEntity
            .created(new URI("/api/maladies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /maladies/:id} : Updates an existing maladies.
     *
     * @param id the id of the maladies to save.
     * @param maladies the maladies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maladies,
     * or with status {@code 400 (Bad Request)} if the maladies is not valid,
     * or with status {@code 500 (Internal Server Error)} if the maladies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/maladies/{id}")
    public ResponseEntity<Maladies> updateMaladies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Maladies maladies
    ) throws URISyntaxException {
        log.debug("REST request to update Maladies : {}, {}", id, maladies);
        if (maladies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maladies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maladiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Maladies result = maladiesRepository.save(maladies);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maladies.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /maladies/:id} : Partial updates given fields of an existing maladies, field will ignore if it is null
     *
     * @param id the id of the maladies to save.
     * @param maladies the maladies to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maladies,
     * or with status {@code 400 (Bad Request)} if the maladies is not valid,
     * or with status {@code 404 (Not Found)} if the maladies is not found,
     * or with status {@code 500 (Internal Server Error)} if the maladies couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/maladies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Maladies> partialUpdateMaladies(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Maladies maladies
    ) throws URISyntaxException {
        log.debug("REST request to partial update Maladies partially : {}, {}", id, maladies);
        if (maladies.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maladies.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maladiesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Maladies> result = maladiesRepository
            .findById(maladies.getId())
            .map(existingMaladies -> {
                if (maladies.getNomMaladie() != null) {
                    existingMaladies.setNomMaladie(maladies.getNomMaladie());
                }
                if (maladies.getFamilleMaladie() != null) {
                    existingMaladies.setFamilleMaladie(maladies.getFamilleMaladie());
                }
                if (maladies.getDescriptionMaladie() != null) {
                    existingMaladies.setDescriptionMaladie(maladies.getDescriptionMaladie());
                }

                return existingMaladies;
            })
            .map(maladiesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maladies.getId().toString())
        );
    }

    /**
     * {@code GET  /maladies} : get all the maladies.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of maladies in body.
     */
    @GetMapping("/maladies")
    public List<Maladies> getAllMaladies(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Maladies");
        return maladiesRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /maladies/:id} : get the "id" maladies.
     *
     * @param id the id of the maladies to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the maladies, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/maladies/{id}")
    public ResponseEntity<Maladies> getMaladies(@PathVariable Long id) {
        log.debug("REST request to get Maladies : {}", id);
        Optional<Maladies> maladies = maladiesRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(maladies);
    }

    /**
     * {@code DELETE  /maladies/:id} : delete the "id" maladies.
     *
     * @param id the id of the maladies to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/maladies/{id}")
    public ResponseEntity<Void> deleteMaladies(@PathVariable Long id) {
        log.debug("REST request to delete Maladies : {}", id);
        maladiesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
