package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Traitements.
 */
@Entity
@Table(name = "traitements")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Traitements implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "observations_traitement")
    private String observationsTraitement;

    @Column(name = "debut_traitement")
    private ZonedDateTime debutTraitement;

    @Column(name = "fin_traitement")
    private ZonedDateTime finTraitement;

    @Column(name = "etat_fin_patient")
    private String etatFinPatient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "traitements", "hospitalisations", "consultations" }, allowSetters = true)
    private Patients patient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "traiters", "famille" }, allowSetters = true)
    private Maladies maladie;

    @ManyToOne
    @JsonIgnoreProperties(value = { "lignes", "ordonners" }, allowSetters = true)
    private Ordonnances ordonnance;

    @ManyToOne
    @JsonIgnoreProperties(value = { "proposers", "consulters", "service" }, allowSetters = true)
    private PersonnelSoignants personnel;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Traitements id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getObservationsTraitement() {
        return this.observationsTraitement;
    }

    public Traitements observationsTraitement(String observationsTraitement) {
        this.setObservationsTraitement(observationsTraitement);
        return this;
    }

    public void setObservationsTraitement(String observationsTraitement) {
        this.observationsTraitement = observationsTraitement;
    }

    public ZonedDateTime getDebutTraitement() {
        return this.debutTraitement;
    }

    public Traitements debutTraitement(ZonedDateTime debutTraitement) {
        this.setDebutTraitement(debutTraitement);
        return this;
    }

    public void setDebutTraitement(ZonedDateTime debutTraitement) {
        this.debutTraitement = debutTraitement;
    }

    public ZonedDateTime getFinTraitement() {
        return this.finTraitement;
    }

    public Traitements finTraitement(ZonedDateTime finTraitement) {
        this.setFinTraitement(finTraitement);
        return this;
    }

    public void setFinTraitement(ZonedDateTime finTraitement) {
        this.finTraitement = finTraitement;
    }

    public String getEtatFinPatient() {
        return this.etatFinPatient;
    }

    public Traitements etatFinPatient(String etatFinPatient) {
        this.setEtatFinPatient(etatFinPatient);
        return this;
    }

    public void setEtatFinPatient(String etatFinPatient) {
        this.etatFinPatient = etatFinPatient;
    }

    public Patients getPatient() {
        return this.patient;
    }

    public void setPatient(Patients patients) {
        this.patient = patients;
    }

    public Traitements patient(Patients patients) {
        this.setPatient(patients);
        return this;
    }

    public Maladies getMaladie() {
        return this.maladie;
    }

    public void setMaladie(Maladies maladies) {
        this.maladie = maladies;
    }

    public Traitements maladie(Maladies maladies) {
        this.setMaladie(maladies);
        return this;
    }

    public Ordonnances getOrdonnance() {
        return this.ordonnance;
    }

    public void setOrdonnance(Ordonnances ordonnances) {
        this.ordonnance = ordonnances;
    }

    public Traitements ordonnance(Ordonnances ordonnances) {
        this.setOrdonnance(ordonnances);
        return this;
    }

    public PersonnelSoignants getPersonnel() {
        return this.personnel;
    }

    public void setPersonnel(PersonnelSoignants personnelSoignants) {
        this.personnel = personnelSoignants;
    }

    public Traitements personnel(PersonnelSoignants personnelSoignants) {
        this.setPersonnel(personnelSoignants);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Traitements)) {
            return false;
        }
        return id != null && id.equals(((Traitements) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Traitements{" +
            "id=" + getId() +
            ", observationsTraitement='" + getObservationsTraitement() + "'" +
            ", debutTraitement='" + getDebutTraitement() + "'" +
            ", finTraitement='" + getFinTraitement() + "'" +
            ", etatFinPatient='" + getEtatFinPatient() + "'" +
            "}";
    }
}
