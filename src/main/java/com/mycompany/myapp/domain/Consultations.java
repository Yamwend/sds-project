package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TypeConsultation;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consultations.
 */
@Entity
@Table(name = "consultations")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consultations implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_consultation")
    private TypeConsultation typeConsultation;

    @Column(name = "observations_consltation")
    private String observationsConsltation;

    @Column(name = "frais_consultion")
    private Integer fraisConsultion;

    @Column(name = "date_consultion")
    private ZonedDateTime dateConsultion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "traitements", "hospitalisations", "consultations" }, allowSetters = true)
    private Patients patient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "proposers", "consulters", "service" }, allowSetters = true)
    private PersonnelSoignants personnel;

    @ManyToOne
    @JsonIgnoreProperties(value = { "demanders", "typeExam", "laboratoire" }, allowSetters = true)
    private Examens examen;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Consultations id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TypeConsultation getTypeConsultation() {
        return this.typeConsultation;
    }

    public Consultations typeConsultation(TypeConsultation typeConsultation) {
        this.setTypeConsultation(typeConsultation);
        return this;
    }

    public void setTypeConsultation(TypeConsultation typeConsultation) {
        this.typeConsultation = typeConsultation;
    }

    public String getObservationsConsltation() {
        return this.observationsConsltation;
    }

    public Consultations observationsConsltation(String observationsConsltation) {
        this.setObservationsConsltation(observationsConsltation);
        return this;
    }

    public void setObservationsConsltation(String observationsConsltation) {
        this.observationsConsltation = observationsConsltation;
    }

    public Integer getFraisConsultion() {
        return this.fraisConsultion;
    }

    public Consultations fraisConsultion(Integer fraisConsultion) {
        this.setFraisConsultion(fraisConsultion);
        return this;
    }

    public void setFraisConsultion(Integer fraisConsultion) {
        this.fraisConsultion = fraisConsultion;
    }

    public ZonedDateTime getDateConsultion() {
        return this.dateConsultion;
    }

    public Consultations dateConsultion(ZonedDateTime dateConsultion) {
        this.setDateConsultion(dateConsultion);
        return this;
    }

    public void setDateConsultion(ZonedDateTime dateConsultion) {
        this.dateConsultion = dateConsultion;
    }

    public Patients getPatient() {
        return this.patient;
    }

    public void setPatient(Patients patients) {
        this.patient = patients;
    }

    public Consultations patient(Patients patients) {
        this.setPatient(patients);
        return this;
    }

    public PersonnelSoignants getPersonnel() {
        return this.personnel;
    }

    public void setPersonnel(PersonnelSoignants personnelSoignants) {
        this.personnel = personnelSoignants;
    }

    public Consultations personnel(PersonnelSoignants personnelSoignants) {
        this.setPersonnel(personnelSoignants);
        return this;
    }

    public Examens getExamen() {
        return this.examen;
    }

    public void setExamen(Examens examens) {
        this.examen = examens;
    }

    public Consultations examen(Examens examens) {
        this.setExamen(examens);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consultations)) {
            return false;
        }
        return id != null && id.equals(((Consultations) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consultations{" +
            "id=" + getId() +
            ", typeConsultation='" + getTypeConsultation() + "'" +
            ", observationsConsltation='" + getObservationsConsltation() + "'" +
            ", fraisConsultion=" + getFraisConsultion() +
            ", dateConsultion='" + getDateConsultion() + "'" +
            "}";
    }
}
