package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Laboratoires.
 */
@Entity
@Table(name = "laboratoires")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Laboratoires implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom_laboratoire")
    private String nomLaboratoire;

    @Column(name = "observations_examens")
    private String observationsExamens;

    @OneToMany(mappedBy = "laboratoire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "demanders", "typeExam", "laboratoire" }, allowSetters = true)
    private Set<Examens> faireExams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Laboratoires id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomLaboratoire() {
        return this.nomLaboratoire;
    }

    public Laboratoires nomLaboratoire(String nomLaboratoire) {
        this.setNomLaboratoire(nomLaboratoire);
        return this;
    }

    public void setNomLaboratoire(String nomLaboratoire) {
        this.nomLaboratoire = nomLaboratoire;
    }

    public String getObservationsExamens() {
        return this.observationsExamens;
    }

    public Laboratoires observationsExamens(String observationsExamens) {
        this.setObservationsExamens(observationsExamens);
        return this;
    }

    public void setObservationsExamens(String observationsExamens) {
        this.observationsExamens = observationsExamens;
    }

    public Set<Examens> getFaireExams() {
        return this.faireExams;
    }

    public void setFaireExams(Set<Examens> examens) {
        if (this.faireExams != null) {
            this.faireExams.forEach(i -> i.setLaboratoire(null));
        }
        if (examens != null) {
            examens.forEach(i -> i.setLaboratoire(this));
        }
        this.faireExams = examens;
    }

    public Laboratoires faireExams(Set<Examens> examens) {
        this.setFaireExams(examens);
        return this;
    }

    public Laboratoires addFaireExam(Examens examens) {
        this.faireExams.add(examens);
        examens.setLaboratoire(this);
        return this;
    }

    public Laboratoires removeFaireExam(Examens examens) {
        this.faireExams.remove(examens);
        examens.setLaboratoire(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Laboratoires)) {
            return false;
        }
        return id != null && id.equals(((Laboratoires) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Laboratoires{" +
            "id=" + getId() +
            ", nomLaboratoire='" + getNomLaboratoire() + "'" +
            ", observationsExamens='" + getObservationsExamens() + "'" +
            "}";
    }
}
