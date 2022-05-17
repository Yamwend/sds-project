package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LigneOrdonnances.
 */
@Entity
@Table(name = "ligne_ordonnances")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LigneOrdonnances implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "medicament")
    private String medicament;

    @Column(name = "posologie")
    private String posologie;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lignes", "ordonners" }, allowSetters = true)
    private Ordonnances ordonnance;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LigneOrdonnances id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMedicament() {
        return this.medicament;
    }

    public LigneOrdonnances medicament(String medicament) {
        this.setMedicament(medicament);
        return this;
    }

    public void setMedicament(String medicament) {
        this.medicament = medicament;
    }

    public String getPosologie() {
        return this.posologie;
    }

    public LigneOrdonnances posologie(String posologie) {
        this.setPosologie(posologie);
        return this;
    }

    public void setPosologie(String posologie) {
        this.posologie = posologie;
    }

    public Ordonnances getOrdonnance() {
        return this.ordonnance;
    }

    public void setOrdonnance(Ordonnances ordonnances) {
        this.ordonnance = ordonnances;
    }

    public LigneOrdonnances ordonnance(Ordonnances ordonnances) {
        this.setOrdonnance(ordonnances);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LigneOrdonnances)) {
            return false;
        }
        return id != null && id.equals(((LigneOrdonnances) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LigneOrdonnances{" +
            "id=" + getId() +
            ", medicament='" + getMedicament() + "'" +
            ", posologie='" + getPosologie() + "'" +
            "}";
    }
}
