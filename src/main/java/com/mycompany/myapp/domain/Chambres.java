package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chambres.
 */
@Entity
@Table(name = "chambres")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Chambres implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numero_chambre")
    private String numeroChambre;

    @Column(name = "localisation_chambre")
    private String localisationChambre;

    @Column(name = "nombreb_lit")
    private Integer nombrebLit;

    @Column(name = "prix_chambre", precision = 21, scale = 2)
    private BigDecimal prixChambre;

    @OneToMany(mappedBy = "chambre")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chambre", "patient" }, allowSetters = true)
    private Set<Hospitalisations> hospitalisers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "chambres" }, allowSetters = true)
    private CategorieChambres categorie;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chambres id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroChambre() {
        return this.numeroChambre;
    }

    public Chambres numeroChambre(String numeroChambre) {
        this.setNumeroChambre(numeroChambre);
        return this;
    }

    public void setNumeroChambre(String numeroChambre) {
        this.numeroChambre = numeroChambre;
    }

    public String getLocalisationChambre() {
        return this.localisationChambre;
    }

    public Chambres localisationChambre(String localisationChambre) {
        this.setLocalisationChambre(localisationChambre);
        return this;
    }

    public void setLocalisationChambre(String localisationChambre) {
        this.localisationChambre = localisationChambre;
    }

    public Integer getNombrebLit() {
        return this.nombrebLit;
    }

    public Chambres nombrebLit(Integer nombrebLit) {
        this.setNombrebLit(nombrebLit);
        return this;
    }

    public void setNombrebLit(Integer nombrebLit) {
        this.nombrebLit = nombrebLit;
    }

    public BigDecimal getPrixChambre() {
        return this.prixChambre;
    }

    public Chambres prixChambre(BigDecimal prixChambre) {
        this.setPrixChambre(prixChambre);
        return this;
    }

    public void setPrixChambre(BigDecimal prixChambre) {
        this.prixChambre = prixChambre;
    }

    public Set<Hospitalisations> getHospitalisers() {
        return this.hospitalisers;
    }

    public void setHospitalisers(Set<Hospitalisations> hospitalisations) {
        if (this.hospitalisers != null) {
            this.hospitalisers.forEach(i -> i.setChambre(null));
        }
        if (hospitalisations != null) {
            hospitalisations.forEach(i -> i.setChambre(this));
        }
        this.hospitalisers = hospitalisations;
    }

    public Chambres hospitalisers(Set<Hospitalisations> hospitalisations) {
        this.setHospitalisers(hospitalisations);
        return this;
    }

    public Chambres addHospitaliser(Hospitalisations hospitalisations) {
        this.hospitalisers.add(hospitalisations);
        hospitalisations.setChambre(this);
        return this;
    }

    public Chambres removeHospitaliser(Hospitalisations hospitalisations) {
        this.hospitalisers.remove(hospitalisations);
        hospitalisations.setChambre(null);
        return this;
    }

    public CategorieChambres getCategorie() {
        return this.categorie;
    }

    public void setCategorie(CategorieChambres categorieChambres) {
        this.categorie = categorieChambres;
    }

    public Chambres categorie(CategorieChambres categorieChambres) {
        this.setCategorie(categorieChambres);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chambres)) {
            return false;
        }
        return id != null && id.equals(((Chambres) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chambres{" +
            "id=" + getId() +
            ", numeroChambre='" + getNumeroChambre() + "'" +
            ", localisationChambre='" + getLocalisationChambre() + "'" +
            ", nombrebLit=" + getNombrebLit() +
            ", prixChambre=" + getPrixChambre() +
            "}";
    }
}
