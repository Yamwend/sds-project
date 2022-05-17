package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Services.
 */
@Entity
@Table(name = "services")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Services implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_service")
    private String libelleService;

    @OneToMany(mappedBy = "service")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "proposers", "consulters", "service" }, allowSetters = true)
    private Set<PersonnelSoignants> services = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Services id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelleService() {
        return this.libelleService;
    }

    public Services libelleService(String libelleService) {
        this.setLibelleService(libelleService);
        return this;
    }

    public void setLibelleService(String libelleService) {
        this.libelleService = libelleService;
    }

    public Set<PersonnelSoignants> getServices() {
        return this.services;
    }

    public void setServices(Set<PersonnelSoignants> personnelSoignants) {
        if (this.services != null) {
            this.services.forEach(i -> i.setService(null));
        }
        if (personnelSoignants != null) {
            personnelSoignants.forEach(i -> i.setService(this));
        }
        this.services = personnelSoignants;
    }

    public Services services(Set<PersonnelSoignants> personnelSoignants) {
        this.setServices(personnelSoignants);
        return this;
    }

    public Services addService(PersonnelSoignants personnelSoignants) {
        this.services.add(personnelSoignants);
        personnelSoignants.setService(this);
        return this;
    }

    public Services removeService(PersonnelSoignants personnelSoignants) {
        this.services.remove(personnelSoignants);
        personnelSoignants.setService(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Services)) {
            return false;
        }
        return id != null && id.equals(((Services) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Services{" +
            "id=" + getId() +
            ", libelleService='" + getLibelleService() + "'" +
            "}";
    }
}
