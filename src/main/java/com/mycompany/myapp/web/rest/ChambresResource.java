package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Chambres;
import com.mycompany.myapp.repository.ChambresRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Chambres}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChambresResource {

    private final Logger log = LoggerFactory.getLogger(ChambresResource.class);

    private static final String ENTITY_NAME = "chambres";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChambresRepository chambresRepository;

    public ChambresResource(ChambresRepository chambresRepository) {
        this.chambresRepository = chambresRepository;
    }

    /**
     * {@code POST  /chambres} : Create a new chambres.
     *
     * @param chambres the chambres to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chambres, or with status {@code 400 (Bad Request)} if the chambres has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chambres")
    public ResponseEntity<Chambres> createChambres(@RequestBody Chambres chambres) throws URISyntaxException {
        log.debug("REST request to save Chambres : {}", chambres);
        if (chambres.getId() != null) {
            throw new BadRequestAlertException("A new chambres cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chambres result = chambresRepository.save(chambres);
        return ResponseEntity
            .created(new URI("/api/chambres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chambres/:id} : Updates an existing chambres.
     *
     * @param id the id of the chambres to save.
     * @param chambres the chambres to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chambres,
     * or with status {@code 400 (Bad Request)} if the chambres is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chambres couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chambres/{id}")
    public ResponseEntity<Chambres> updateChambres(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Chambres chambres
    ) throws URISyntaxException {
        log.debug("REST request to update Chambres : {}, {}", id, chambres);
        if (chambres.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chambres.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chambresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chambres result = chambresRepository.save(chambres);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chambres.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chambres/:id} : Partial updates given fields of an existing chambres, field will ignore if it is null
     *
     * @param id the id of the chambres to save.
     * @param chambres the chambres to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chambres,
     * or with status {@code 400 (Bad Request)} if the chambres is not valid,
     * or with status {@code 404 (Not Found)} if the chambres is not found,
     * or with status {@code 500 (Internal Server Error)} if the chambres couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chambres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chambres> partialUpdateChambres(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Chambres chambres
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chambres partially : {}, {}", id, chambres);
        if (chambres.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chambres.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chambresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chambres> result = chambresRepository
            .findById(chambres.getId())
            .map(existingChambres -> {
                if (chambres.getNumeroChambre() != null) {
                    existingChambres.setNumeroChambre(chambres.getNumeroChambre());
                }
                if (chambres.getLocalisationChambre() != null) {
                    existingChambres.setLocalisationChambre(chambres.getLocalisationChambre());
                }
                if (chambres.getNombrebLit() != null) {
                    existingChambres.setNombrebLit(chambres.getNombrebLit());
                }
                if (chambres.getPrixChambre() != null) {
                    existingChambres.setPrixChambre(chambres.getPrixChambre());
                }

                return existingChambres;
            })
            .map(chambresRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chambres.getId().toString())
        );
    }

    /**
     * {@code GET  /chambres} : get all the chambres.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chambres in body.
     */
    @GetMapping("/chambres")
    public List<Chambres> getAllChambres(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Chambres");
        return chambresRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /chambres/:id} : get the "id" chambres.
     *
     * @param id the id of the chambres to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chambres, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chambres/{id}")
    public ResponseEntity<Chambres> getChambres(@PathVariable Long id) {
        log.debug("REST request to get Chambres : {}", id);
        Optional<Chambres> chambres = chambresRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(chambres);
    }

    /**
     * {@code DELETE  /chambres/:id} : delete the "id" chambres.
     *
     * @param id the id of the chambres to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chambres/{id}")
    public ResponseEntity<Void> deleteChambres(@PathVariable Long id) {
        log.debug("REST request to delete Chambres : {}", id);
        chambresRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
