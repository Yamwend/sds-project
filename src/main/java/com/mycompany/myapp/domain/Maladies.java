package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Maladies.
 */
@Entity
@Table(name = "maladies")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Maladies implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom_maladie")
    private String nomMaladie;

    @Column(name = "famille_maladie")
    private String familleMaladie;

    @Column(name = "description_maladie")
    private String descriptionMaladie;

    @OneToMany(mappedBy = "maladie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "maladie", "ordonnance", "personnel" }, allowSetters = true)
    private Set<Traitements> traiters = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "maladies" }, allowSetters = true)
    private FamilleMaladies famille;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Maladies id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomMaladie() {
        return this.nomMaladie;
    }

    public Maladies nomMaladie(String nomMaladie) {
        this.setNomMaladie(nomMaladie);
        return this;
    }

    public void setNomMaladie(String nomMaladie) {
        this.nomMaladie = nomMaladie;
    }

    public String getFamilleMaladie() {
        return this.familleMaladie;
    }

    public Maladies familleMaladie(String familleMaladie) {
        this.setFamilleMaladie(familleMaladie);
        return this;
    }

    public void setFamilleMaladie(String familleMaladie) {
        this.familleMaladie = familleMaladie;
    }

    public String getDescriptionMaladie() {
        return this.descriptionMaladie;
    }

    public Maladies descriptionMaladie(String descriptionMaladie) {
        this.setDescriptionMaladie(descriptionMaladie);
        return this;
    }

    public void setDescriptionMaladie(String descriptionMaladie) {
        this.descriptionMaladie = descriptionMaladie;
    }

    public Set<Traitements> getTraiters() {
        return this.traiters;
    }

    public void setTraiters(Set<Traitements> traitements) {
        if (this.traiters != null) {
            this.traiters.forEach(i -> i.setMaladie(null));
        }
        if (traitements != null) {
            traitements.forEach(i -> i.setMaladie(this));
        }
        this.traiters = traitements;
    }

    public Maladies traiters(Set<Traitements> traitements) {
        this.setTraiters(traitements);
        return this;
    }

    public Maladies addTraiter(Traitements traitements) {
        this.traiters.add(traitements);
        traitements.setMaladie(this);
        return this;
    }

    public Maladies removeTraiter(Traitements traitements) {
        this.traiters.remove(traitements);
        traitements.setMaladie(null);
        return this;
    }

    public FamilleMaladies getFamille() {
        return this.famille;
    }

    public void setFamille(FamilleMaladies familleMaladies) {
        this.famille = familleMaladies;
    }

    public Maladies famille(FamilleMaladies familleMaladies) {
        this.setFamille(familleMaladies);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Maladies)) {
            return false;
        }
        return id != null && id.equals(((Maladies) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Maladies{" +
            "id=" + getId() +
            ", nomMaladie='" + getNomMaladie() + "'" +
            ", familleMaladie='" + getFamilleMaladie() + "'" +
            ", descriptionMaladie='" + getDescriptionMaladie() + "'" +
            "}";
    }
}
