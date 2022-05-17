package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Services;
import com.mycompany.myapp.repository.ServicesRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Services}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ServicesResource {

    private final Logger log = LoggerFactory.getLogger(ServicesResource.class);

    private static final String ENTITY_NAME = "services";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServicesRepository servicesRepository;

    public ServicesResource(ServicesRepository servicesRepository) {
        this.servicesRepository = servicesRepository;
    }

    /**
     * {@code POST  /services} : Create a new services.
     *
     * @param services the services to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new services, or with status {@code 400 (Bad Request)} if the services has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/services")
    public ResponseEntity<Services> createServices(@RequestBody Services services) throws URISyntaxException {
        log.debug("REST request to save Services : {}", services);
        if (services.getId() != null) {
            throw new BadRequestAlertException("A new services cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Services result = servicesRepository.save(services);
        return ResponseEntity
            .created(new URI("/api/services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /services/:id} : Updates an existing services.
     *
     * @param id the id of the services to save.
     * @param services the services to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated services,
     * or with status {@code 400 (Bad Request)} if the services is not valid,
     * or with status {@code 500 (Internal Server Error)} if the services couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/services/{id}")
    public ResponseEntity<Services> updateServices(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Services services
    ) throws URISyntaxException {
        log.debug("REST request to update Services : {}, {}", id, services);
        if (services.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, services.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!servicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Services result = servicesRepository.save(services);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, services.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /services/:id} : Partial updates given fields of an existing services, field will ignore if it is null
     *
     * @param id the id of the services to save.
     * @param services the services to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated services,
     * or with status {@code 400 (Bad Request)} if the services is not valid,
     * or with status {@code 404 (Not Found)} if the services is not found,
     * or with status {@code 500 (Internal Server Error)} if the services couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/services/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Services> partialUpdateServices(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Services services
    ) throws URISyntaxException {
        log.debug("REST request to partial update Services partially : {}, {}", id, services);
        if (services.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, services.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!servicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Services> result = servicesRepository
            .findById(services.getId())
            .map(existingServices -> {
                if (services.getLibelleService() != null) {
                    existingServices.setLibelleService(services.getLibelleService());
                }

                return existingServices;
            })
            .map(servicesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, services.getId().toString())
        );
    }

    /**
     * {@code GET  /services} : get all the services.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of services in body.
     */
    @GetMapping("/services")
    public List<Services> getAllServices() {
        log.debug("REST request to get all Services");
        return servicesRepository.findAll();
    }

    /**
     * {@code GET  /services/:id} : get the "id" services.
     *
     * @param id the id of the services to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the services, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/services/{id}")
    public ResponseEntity<Services> getServices(@PathVariable Long id) {
        log.debug("REST request to get Services : {}", id);
        Optional<Services> services = servicesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(services);
    }

    /**
     * {@code DELETE  /services/:id} : delete the "id" services.
     *
     * @param id the id of the services to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteServices(@PathVariable Long id) {
        log.debug("REST request to delete Services : {}", id);
        servicesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
