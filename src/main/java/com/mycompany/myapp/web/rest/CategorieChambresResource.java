package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CategorieChambres;
import com.mycompany.myapp.repository.CategorieChambresRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.CategorieChambres}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CategorieChambresResource {

    private final Logger log = LoggerFactory.getLogger(CategorieChambresResource.class);

    private static final String ENTITY_NAME = "categorieChambres";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategorieChambresRepository categorieChambresRepository;

    public CategorieChambresResource(CategorieChambresRepository categorieChambresRepository) {
        this.categorieChambresRepository = categorieChambresRepository;
    }

    /**
     * {@code POST  /categorie-chambres} : Create a new categorieChambres.
     *
     * @param categorieChambres the categorieChambres to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categorieChambres, or with status {@code 400 (Bad Request)} if the categorieChambres has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/categorie-chambres")
    public ResponseEntity<CategorieChambres> createCategorieChambres(@RequestBody CategorieChambres categorieChambres)
        throws URISyntaxException {
        log.debug("REST request to save CategorieChambres : {}", categorieChambres);
        if (categorieChambres.getId() != null) {
            throw new BadRequestAlertException("A new categorieChambres cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategorieChambres result = categorieChambresRepository.save(categorieChambres);
        return ResponseEntity
            .created(new URI("/api/categorie-chambres/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /categorie-chambres/:id} : Updates an existing categorieChambres.
     *
     * @param id the id of the categorieChambres to save.
     * @param categorieChambres the categorieChambres to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorieChambres,
     * or with status {@code 400 (Bad Request)} if the categorieChambres is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categorieChambres couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/categorie-chambres/{id}")
    public ResponseEntity<CategorieChambres> updateCategorieChambres(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CategorieChambres categorieChambres
    ) throws URISyntaxException {
        log.debug("REST request to update CategorieChambres : {}, {}", id, categorieChambres);
        if (categorieChambres.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, categorieChambres.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!categorieChambresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CategorieChambres result = categorieChambresRepository.save(categorieChambres);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categorieChambres.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /categorie-chambres/:id} : Partial updates given fields of an existing categorieChambres, field will ignore if it is null
     *
     * @param id the id of the categorieChambres to save.
     * @param categorieChambres the categorieChambres to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categorieChambres,
     * or with status {@code 400 (Bad Request)} if the categorieChambres is not valid,
     * or with status {@code 404 (Not Found)} if the categorieChambres is not found,
     * or with status {@code 500 (Internal Server Error)} if the categorieChambres couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/categorie-chambres/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CategorieChambres> partialUpdateCategorieChambres(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CategorieChambres categorieChambres
    ) throws URISyntaxException {
        log.debug("REST request to partial update CategorieChambres partially : {}, {}", id, categorieChambres);
        if (categorieChambres.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, categorieChambres.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!categorieChambresRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CategorieChambres> result = categorieChambresRepository
            .findById(categorieChambres.getId())
            .map(existingCategorieChambres -> {
                if (categorieChambres.getLibelleCategory() != null) {
                    existingCategorieChambres.setLibelleCategory(categorieChambres.getLibelleCategory());
                }
                if (categorieChambres.getDescriptionChambre() != null) {
                    existingCategorieChambres.setDescriptionChambre(categorieChambres.getDescriptionChambre());
                }

                return existingCategorieChambres;
            })
            .map(categorieChambresRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categorieChambres.getId().toString())
        );
    }

    /**
     * {@code GET  /categorie-chambres} : get all the categorieChambres.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categorieChambres in body.
     */
    @GetMapping("/categorie-chambres")
    public List<CategorieChambres> getAllCategorieChambres() {
        log.debug("REST request to get all CategorieChambres");
        return categorieChambresRepository.findAll();
    }

    /**
     * {@code GET  /categorie-chambres/:id} : get the "id" categorieChambres.
     *
     * @param id the id of the categorieChambres to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categorieChambres, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/categorie-chambres/{id}")
    public ResponseEntity<CategorieChambres> getCategorieChambres(@PathVariable Long id) {
        log.debug("REST request to get CategorieChambres : {}", id);
        Optional<CategorieChambres> categorieChambres = categorieChambresRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(categorieChambres);
    }

    /**
     * {@code DELETE  /categorie-chambres/:id} : delete the "id" categorieChambres.
     *
     * @param id the id of the categorieChambres to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/categorie-chambres/{id}")
    public ResponseEntity<Void> deleteCategorieChambres(@PathVariable Long id) {
        log.debug("REST request to delete CategorieChambres : {}", id);
        categorieChambresRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
