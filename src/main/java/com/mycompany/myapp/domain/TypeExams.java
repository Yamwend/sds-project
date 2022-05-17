package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TypeExams.
 */
@Entity
@Table(name = "type_exams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TypeExams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "libelle_type")
    private String libelleType;

    @Column(name = "descruption_type")
    private String descruptionType;

    @OneToMany(mappedBy = "typeExam")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "demanders", "typeExam", "laboratoire" }, allowSetters = true)
    private Set<Examens> types = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TypeExams id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelleType() {
        return this.libelleType;
    }

    public TypeExams libelleType(String libelleType) {
        this.setLibelleType(libelleType);
        return this;
    }

    public void setLibelleType(String libelleType) {
        this.libelleType = libelleType;
    }

    public String getDescruptionType() {
        return this.descruptionType;
    }

    public TypeExams descruptionType(String descruptionType) {
        this.setDescruptionType(descruptionType);
        return this;
    }

    public void setDescruptionType(String descruptionType) {
        this.descruptionType = descruptionType;
    }

    public Set<Examens> getTypes() {
        return this.types;
    }

    public void setTypes(Set<Examens> examens) {
        if (this.types != null) {
            this.types.forEach(i -> i.setTypeExam(null));
        }
        if (examens != null) {
            examens.forEach(i -> i.setTypeExam(this));
        }
        this.types = examens;
    }

    public TypeExams types(Set<Examens> examens) {
        this.setTypes(examens);
        return this;
    }

    public TypeExams addType(Examens examens) {
        this.types.add(examens);
        examens.setTypeExam(this);
        return this;
    }

    public TypeExams removeType(Examens examens) {
        this.types.remove(examens);
        examens.setTypeExam(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TypeExams)) {
            return false;
        }
        return id != null && id.equals(((TypeExams) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TypeExams{" +
            "id=" + getId() +
            ", libelleType='" + getLibelleType() + "'" +
            ", descruptionType='" + getDescruptionType() + "'" +
            "}";
    }
}
