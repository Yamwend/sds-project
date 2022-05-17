package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.PersonnelSoignants;
import com.mycompany.myapp.repository.PersonnelSoignantsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.PersonnelSoignants}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PersonnelSoignantsResource {

    private final Logger log = LoggerFactory.getLogger(PersonnelSoignantsResource.class);

    private static final String ENTITY_NAME = "personnelSoignants";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PersonnelSoignantsRepository personnelSoignantsRepository;

    public PersonnelSoignantsResource(PersonnelSoignantsRepository personnelSoignantsRepository) {
        this.personnelSoignantsRepository = personnelSoignantsRepository;
    }

    /**
     * {@code POST  /personnel-soignants} : Create a new personnelSoignants.
     *
     * @param personnelSoignants the personnelSoignants to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new personnelSoignants, or with status {@code 400 (Bad Request)} if the personnelSoignants has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/personnel-soignants")
    public ResponseEntity<PersonnelSoignants> createPersonnelSoignants(@RequestBody PersonnelSoignants personnelSoignants)
        throws URISyntaxException {
        log.debug("REST request to save PersonnelSoignants : {}", personnelSoignants);
        if (personnelSoignants.getId() != null) {
            throw new BadRequestAlertException("A new personnelSoignants cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PersonnelSoignants result = personnelSoignantsRepository.save(personnelSoignants);
        return ResponseEntity
            .created(new URI("/api/personnel-soignants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /personnel-soignants/:id} : Updates an existing personnelSoignants.
     *
     * @param id the id of the personnelSoignants to save.
     * @param personnelSoignants the personnelSoignants to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personnelSoignants,
     * or with status {@code 400 (Bad Request)} if the personnelSoignants is not valid,
     * or with status {@code 500 (Internal Server Error)} if the personnelSoignants couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/personnel-soignants/{id}")
    public ResponseEntity<PersonnelSoignants> updatePersonnelSoignants(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PersonnelSoignants personnelSoignants
    ) throws URISyntaxException {
        log.debug("REST request to update PersonnelSoignants : {}, {}", id, personnelSoignants);
        if (personnelSoignants.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personnelSoignants.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personnelSoignantsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PersonnelSoignants result = personnelSoignantsRepository.save(personnelSoignants);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personnelSoignants.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /personnel-soignants/:id} : Partial updates given fields of an existing personnelSoignants, field will ignore if it is null
     *
     * @param id the id of the personnelSoignants to save.
     * @param personnelSoignants the personnelSoignants to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated personnelSoignants,
     * or with status {@code 400 (Bad Request)} if the personnelSoignants is not valid,
     * or with status {@code 404 (Not Found)} if the personnelSoignants is not found,
     * or with status {@code 500 (Internal Server Error)} if the personnelSoignants couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/personnel-soignants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PersonnelSoignants> partialUpdatePersonnelSoignants(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PersonnelSoignants personnelSoignants
    ) throws URISyntaxException {
        log.debug("REST request to partial update PersonnelSoignants partially : {}, {}", id, personnelSoignants);
        if (personnelSoignants.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, personnelSoignants.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!personnelSoignantsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PersonnelSoignants> result = personnelSoignantsRepository
            .findById(personnelSoignants.getId())
            .map(existingPersonnelSoignants -> {
                if (personnelSoignants.getCodePersonne() != null) {
                    existingPersonnelSoignants.setCodePersonne(personnelSoignants.getCodePersonne());
                }
                if (personnelSoignants.getNomPersonne() != null) {
                    existingPersonnelSoignants.setNomPersonne(personnelSoignants.getNomPersonne());
                }
                if (personnelSoignants.getPrenomPersonne() != null) {
                    existingPersonnelSoignants.setPrenomPersonne(personnelSoignants.getPrenomPersonne());
                }
                if (personnelSoignants.getGradePersonne() != null) {
                    existingPersonnelSoignants.setGradePersonne(personnelSoignants.getGradePersonne());
                }
                if (personnelSoignants.getFonctionPersonne() != null) {
                    existingPersonnelSoignants.setFonctionPersonne(personnelSoignants.getFonctionPersonne());
                }
                if (personnelSoignants.getTelphonePersonne() != null) {
                    existingPersonnelSoignants.setTelphonePersonne(personnelSoignants.getTelphonePersonne());
                }
                if (personnelSoignants.getEmailPersonne() != null) {
                    existingPersonnelSoignants.setEmailPersonne(personnelSoignants.getEmailPersonne());
                }
                if (personnelSoignants.getAdressePersonne() != null) {
                    existingPersonnelSoignants.setAdressePersonne(personnelSoignants.getAdressePersonne());
                }
                if (personnelSoignants.getDateDeNaissPersonne() != null) {
                    existingPersonnelSoignants.setDateDeNaissPersonne(personnelSoignants.getDateDeNaissPersonne());
                }

                return existingPersonnelSoignants;
            })
            .map(personnelSoignantsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, personnelSoignants.getId().toString())
        );
    }

    /**
     * {@code GET  /personnel-soignants} : get all the personnelSoignants.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of personnelSoignants in body.
     */
    @GetMapping("/personnel-soignants")
    public List<PersonnelSoignants> getAllPersonnelSoignants(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all PersonnelSoignants");
        return personnelSoignantsRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /personnel-soignants/:id} : get the "id" personnelSoignants.
     *
     * @param id the id of the personnelSoignants to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the personnelSoignants, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/personnel-soignants/{id}")
    public ResponseEntity<PersonnelSoignants> getPersonnelSoignants(@PathVariable Long id) {
        log.debug("REST request to get PersonnelSoignants : {}", id);
        Optional<PersonnelSoignants> personnelSoignants = personnelSoignantsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(personnelSoignants);
    }

    /**
     * {@code DELETE  /personnel-soignants/:id} : delete the "id" personnelSoignants.
     *
     * @param id the id of the personnelSoignants to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/personnel-soignants/{id}")
    public ResponseEntity<Void> deletePersonnelSoignants(@PathVariable Long id) {
        log.debug("REST request to delete PersonnelSoignants : {}", id);
        personnelSoignantsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
