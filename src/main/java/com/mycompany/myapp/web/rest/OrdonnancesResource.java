package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Ordonnances;
import com.mycompany.myapp.repository.OrdonnancesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Ordonnances}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrdonnancesResource {

    private final Logger log = LoggerFactory.getLogger(OrdonnancesResource.class);

    private static final String ENTITY_NAME = "ordonnances";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrdonnancesRepository ordonnancesRepository;

    public OrdonnancesResource(OrdonnancesRepository ordonnancesRepository) {
        this.ordonnancesRepository = ordonnancesRepository;
    }

    /**
     * {@code POST  /ordonnances} : Create a new ordonnances.
     *
     * @param ordonnances the ordonnances to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ordonnances, or with status {@code 400 (Bad Request)} if the ordonnances has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ordonnances")
    public ResponseEntity<Ordonnances> createOrdonnances(@RequestBody Ordonnances ordonnances) throws URISyntaxException {
        log.debug("REST request to save Ordonnances : {}", ordonnances);
        if (ordonnances.getId() != null) {
            throw new BadRequestAlertException("A new ordonnances cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ordonnances result = ordonnancesRepository.save(ordonnances);
        return ResponseEntity
            .created(new URI("/api/ordonnances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ordonnances/:id} : Updates an existing ordonnances.
     *
     * @param id the id of the ordonnances to save.
     * @param ordonnances the ordonnances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ordonnances,
     * or with status {@code 400 (Bad Request)} if the ordonnances is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ordonnances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ordonnances/{id}")
    public ResponseEntity<Ordonnances> updateOrdonnances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ordonnances ordonnances
    ) throws URISyntaxException {
        log.debug("REST request to update Ordonnances : {}, {}", id, ordonnances);
        if (ordonnances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ordonnances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ordonnancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ordonnances result = ordonnancesRepository.save(ordonnances);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordonnances.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ordonnances/:id} : Partial updates given fields of an existing ordonnances, field will ignore if it is null
     *
     * @param id the id of the ordonnances to save.
     * @param ordonnances the ordonnances to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ordonnances,
     * or with status {@code 400 (Bad Request)} if the ordonnances is not valid,
     * or with status {@code 404 (Not Found)} if the ordonnances is not found,
     * or with status {@code 500 (Internal Server Error)} if the ordonnances couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ordonnances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Ordonnances> partialUpdateOrdonnances(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ordonnances ordonnances
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ordonnances partially : {}, {}", id, ordonnances);
        if (ordonnances.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ordonnances.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ordonnancesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ordonnances> result = ordonnancesRepository
            .findById(ordonnances.getId())
            .map(existingOrdonnances -> {
                if (ordonnances.getNumero() != null) {
                    existingOrdonnances.setNumero(ordonnances.getNumero());
                }

                return existingOrdonnances;
            })
            .map(ordonnancesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ordonnances.getId().toString())
        );
    }

    /**
     * {@code GET  /ordonnances} : get all the ordonnances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ordonnances in body.
     */
    @GetMapping("/ordonnances")
    public List<Ordonnances> getAllOrdonnances() {
        log.debug("REST request to get all Ordonnances");
        return ordonnancesRepository.findAll();
    }

    /**
     * {@code GET  /ordonnances/:id} : get the "id" ordonnances.
     *
     * @param id the id of the ordonnances to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ordonnances, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ordonnances/{id}")
    public ResponseEntity<Ordonnances> getOrdonnances(@PathVariable Long id) {
        log.debug("REST request to get Ordonnances : {}", id);
        Optional<Ordonnances> ordonnances = ordonnancesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(ordonnances);
    }

    /**
     * {@code DELETE  /ordonnances/:id} : delete the "id" ordonnances.
     *
     * @param id the id of the ordonnances to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ordonnances/{id}")
    public ResponseEntity<Void> deleteOrdonnances(@PathVariable Long id) {
        log.debug("REST request to delete Ordonnances : {}", id);
        ordonnancesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
