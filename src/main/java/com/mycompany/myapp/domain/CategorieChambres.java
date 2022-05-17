package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CategorieChambres.
 */
@Entity
@Table(name = "categorie_chambres")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CategorieChambres implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_category")
    private String libelleCategory;

    @Column(name = "description_chambre")
    private String descriptionChambre;

    @OneToMany(mappedBy = "categorie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "hospitalisers", "categorie" }, allowSetters = true)
    private Set<Chambres> chambres = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CategorieChambres id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelleCategory() {
        return this.libelleCategory;
    }

    public CategorieChambres libelleCategory(String libelleCategory) {
        this.setLibelleCategory(libelleCategory);
        return this;
    }

    public void setLibelleCategory(String libelleCategory) {
        this.libelleCategory = libelleCategory;
    }

    public String getDescriptionChambre() {
        return this.descriptionChambre;
    }

    public CategorieChambres descriptionChambre(String descriptionChambre) {
        this.setDescriptionChambre(descriptionChambre);
        return this;
    }

    public void setDescriptionChambre(String descriptionChambre) {
        this.descriptionChambre = descriptionChambre;
    }

    public Set<Chambres> getChambres() {
        return this.chambres;
    }

    public void setChambres(Set<Chambres> chambres) {
        if (this.chambres != null) {
            this.chambres.forEach(i -> i.setCategorie(null));
        }
        if (chambres != null) {
            chambres.forEach(i -> i.setCategorie(this));
        }
        this.chambres = chambres;
    }

    public CategorieChambres chambres(Set<Chambres> chambres) {
        this.setChambres(chambres);
        return this;
    }

    public CategorieChambres addChambre(Chambres chambres) {
        this.chambres.add(chambres);
        chambres.setCategorie(this);
        return this;
    }

    public CategorieChambres removeChambre(Chambres chambres) {
        this.chambres.remove(chambres);
        chambres.setCategorie(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CategorieChambres)) {
            return false;
        }
        return id != null && id.equals(((CategorieChambres) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CategorieChambres{" +
            "id=" + getId() +
            ", libelleCategory='" + getLibelleCategory() + "'" +
            ", descriptionChambre='" + getDescriptionChambre() + "'" +
            "}";
    }
}
