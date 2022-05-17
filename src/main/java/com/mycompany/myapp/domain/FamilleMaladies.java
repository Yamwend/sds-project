package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FamilleMaladies.
 */
@Entity
@Table(name = "famille_maladies")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FamilleMaladies implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_f_maladie")
    private String libelleFMaladie;

    @Column(name = "description_f_maladie")
    private String descriptionFMaladie;

    @OneToMany(mappedBy = "famille")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "traiters", "famille" }, allowSetters = true)
    private Set<Maladies> maladies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FamilleMaladies id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelleFMaladie() {
        return this.libelleFMaladie;
    }

    public FamilleMaladies libelleFMaladie(String libelleFMaladie) {
        this.setLibelleFMaladie(libelleFMaladie);
        return this;
    }

    public void setLibelleFMaladie(String libelleFMaladie) {
        this.libelleFMaladie = libelleFMaladie;
    }

    public String getDescriptionFMaladie() {
        return this.descriptionFMaladie;
    }

    public FamilleMaladies descriptionFMaladie(String descriptionFMaladie) {
        this.setDescriptionFMaladie(descriptionFMaladie);
        return this;
    }

    public void setDescriptionFMaladie(String descriptionFMaladie) {
        this.descriptionFMaladie = descriptionFMaladie;
    }

    public Set<Maladies> getMaladies() {
        return this.maladies;
    }

    public void setMaladies(Set<Maladies> maladies) {
        if (this.maladies != null) {
            this.maladies.forEach(i -> i.setFamille(null));
        }
        if (maladies != null) {
            maladies.forEach(i -> i.setFamille(this));
        }
        this.maladies = maladies;
    }

    public FamilleMaladies maladies(Set<Maladies> maladies) {
        this.setMaladies(maladies);
        return this;
    }

    public FamilleMaladies addMaladie(Maladies maladies) {
        this.maladies.add(maladies);
        maladies.setFamille(this);
        return this;
    }

    public FamilleMaladies removeMaladie(Maladies maladies) {
        this.maladies.remove(maladies);
        maladies.setFamille(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilleMaladies)) {
            return false;
        }
        return id != null && id.equals(((FamilleMaladies) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FamilleMaladies{" +
            "id=" + getId() +
            ", libelleFMaladie='" + getLibelleFMaladie() + "'" +
            ", descriptionFMaladie='" + getDescriptionFMaladie() + "'" +
            "}";
    }
}
