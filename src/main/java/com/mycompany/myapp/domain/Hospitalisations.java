package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Hospitalisations.
 */
@Entity
@Table(name = "hospitalisations")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Hospitalisations implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date_arrivee")
    private ZonedDateTime dateArrivee;

    @Column(name = "date_sortie")
    private ZonedDateTime dateSortie;

    @Column(name = "observations_hospitalisation")
    private String observationsHospitalisation;

    @ManyToOne
    @JsonIgnoreProperties(value = { "hospitalisers", "categorie" }, allowSetters = true)
    private Chambres chambre;

    @ManyToOne
    @JsonIgnoreProperties(value = { "traitements", "hospitalisations", "consultations" }, allowSetters = true)
    private Patients patient;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Hospitalisations id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDateArrivee() {
        return this.dateArrivee;
    }

    public Hospitalisations dateArrivee(ZonedDateTime dateArrivee) {
        this.setDateArrivee(dateArrivee);
        return this;
    }

    public void setDateArrivee(ZonedDateTime dateArrivee) {
        this.dateArrivee = dateArrivee;
    }

    public ZonedDateTime getDateSortie() {
        return this.dateSortie;
    }

    public Hospitalisations dateSortie(ZonedDateTime dateSortie) {
        this.setDateSortie(dateSortie);
        return this;
    }

    public void setDateSortie(ZonedDateTime dateSortie) {
        this.dateSortie = dateSortie;
    }

    public String getObservationsHospitalisation() {
        return this.observationsHospitalisation;
    }

    public Hospitalisations observationsHospitalisation(String observationsHospitalisation) {
        this.setObservationsHospitalisation(observationsHospitalisation);
        return this;
    }

    public void setObservationsHospitalisation(String observationsHospitalisation) {
        this.observationsHospitalisation = observationsHospitalisation;
    }

    public Chambres getChambre() {
        return this.chambre;
    }

    public void setChambre(Chambres chambres) {
        this.chambre = chambres;
    }

    public Hospitalisations chambre(Chambres chambres) {
        this.setChambre(chambres);
        return this;
    }

    public Patients getPatient() {
        return this.patient;
    }

    public void setPatient(Patients patients) {
        this.patient = patients;
    }

    public Hospitalisations patient(Patients patients) {
        this.setPatient(patients);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Hospitalisations)) {
            return false;
        }
        return id != null && id.equals(((Hospitalisations) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Hospitalisations{" +
            "id=" + getId() +
            ", dateArrivee='" + getDateArrivee() + "'" +
            ", dateSortie='" + getDateSortie() + "'" +
            ", observationsHospitalisation='" + getObservationsHospitalisation() + "'" +
            "}";
    }
}
