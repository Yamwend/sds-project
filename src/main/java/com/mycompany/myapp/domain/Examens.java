package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Examens.
 */
@Entity
@Table(name = "examens")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Examens implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nom_examen")
    private String nomExamen;

    @Column(name = "type_examen")
    private String typeExamen;

    @Column(name = "date_examen")
    private ZonedDateTime dateExamen;

    @OneToMany(mappedBy = "examen")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "personnel", "examen" }, allowSetters = true)
    private Set<Consultations> demanders = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "types" }, allowSetters = true)
    private TypeExams typeExam;

    @ManyToOne
    @JsonIgnoreProperties(value = { "faireExams" }, allowSetters = true)
    private Laboratoires laboratoire;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Examens id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomExamen() {
        return this.nomExamen;
    }

    public Examens nomExamen(String nomExamen) {
        this.setNomExamen(nomExamen);
        return this;
    }

    public void setNomExamen(String nomExamen) {
        this.nomExamen = nomExamen;
    }

    public String getTypeExamen() {
        return this.typeExamen;
    }

    public Examens typeExamen(String typeExamen) {
        this.setTypeExamen(typeExamen);
        return this;
    }

    public void setTypeExamen(String typeExamen) {
        this.typeExamen = typeExamen;
    }

    public ZonedDateTime getDateExamen() {
        return this.dateExamen;
    }

    public Examens dateExamen(ZonedDateTime dateExamen) {
        this.setDateExamen(dateExamen);
        return this;
    }

    public void setDateExamen(ZonedDateTime dateExamen) {
        this.dateExamen = dateExamen;
    }

    public Set<Consultations> getDemanders() {
        return this.demanders;
    }

    public void setDemanders(Set<Consultations> consultations) {
        if (this.demanders != null) {
            this.demanders.forEach(i -> i.setExamen(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setExamen(this));
        }
        this.demanders = consultations;
    }

    public Examens demanders(Set<Consultations> consultations) {
        this.setDemanders(consultations);
        return this;
    }

    public Examens addDemander(Consultations consultations) {
        this.demanders.add(consultations);
        consultations.setExamen(this);
        return this;
    }

    public Examens removeDemander(Consultations consultations) {
        this.demanders.remove(consultations);
        consultations.setExamen(null);
        return this;
    }

    public TypeExams getTypeExam() {
        return this.typeExam;
    }

    public void setTypeExam(TypeExams typeExams) {
        this.typeExam = typeExams;
    }

    public Examens typeExam(TypeExams typeExams) {
        this.setTypeExam(typeExams);
        return this;
    }

    public Laboratoires getLaboratoire() {
        return this.laboratoire;
    }

    public void setLaboratoire(Laboratoires laboratoires) {
        this.laboratoire = laboratoires;
    }

    public Examens laboratoire(Laboratoires laboratoires) {
        this.setLaboratoire(laboratoires);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Examens)) {
            return false;
        }
        return id != null && id.equals(((Examens) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Examens{" +
            "id=" + getId() +
            ", nomExamen='" + getNomExamen() + "'" +
            ", typeExamen='" + getTypeExamen() + "'" +
            ", dateExamen='" + getDateExamen() + "'" +
            "}";
    }
}
