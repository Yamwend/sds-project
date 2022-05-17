package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Sexe;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patients.
 */
@Entity
@Table(name = "patients")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patients implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code_pat")
    private String codePat;

    @Column(name = "nom_pat")
    private String nomPat;

    @Column(name = "prenom_pat")
    private String prenomPat;

    @Enumerated(EnumType.STRING)
    @Column(name = "sexe_pat")
    private Sexe sexePat;

    @Column(name = "adresse_pat")
    private String adressePat;

    @Column(name = "telephone_pat")
    private String telephonePat;

    @Column(name = "email_pat")
    private String emailPat;

    @Column(name = "origine_pat")
    private String originePat;

    @Column(name = "profession_pat")
    private String professionPat;

    @Column(name = "age_pat")
    private ZonedDateTime agePat;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "maladie", "ordonnance", "personnel" }, allowSetters = true)
    private Set<Traitements> traitements = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chambre", "patient" }, allowSetters = true)
    private Set<Hospitalisations> hospitalisations = new HashSet<>();

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "personnel", "examen" }, allowSetters = true)
    private Set<Consultations> consultations = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Patients id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodePat() {
        return this.codePat;
    }

    public Patients codePat(String codePat) {
        this.setCodePat(codePat);
        return this;
    }

    public void setCodePat(String codePat) {
        this.codePat = codePat;
    }

    public String getNomPat() {
        return this.nomPat;
    }

    public Patients nomPat(String nomPat) {
        this.setNomPat(nomPat);
        return this;
    }

    public void setNomPat(String nomPat) {
        this.nomPat = nomPat;
    }

    public String getPrenomPat() {
        return this.prenomPat;
    }

    public Patients prenomPat(String prenomPat) {
        this.setPrenomPat(prenomPat);
        return this;
    }

    public void setPrenomPat(String prenomPat) {
        this.prenomPat = prenomPat;
    }

    public Sexe getSexePat() {
        return this.sexePat;
    }

    public Patients sexePat(Sexe sexePat) {
        this.setSexePat(sexePat);
        return this;
    }

    public void setSexePat(Sexe sexePat) {
        this.sexePat = sexePat;
    }

    public String getAdressePat() {
        return this.adressePat;
    }

    public Patients adressePat(String adressePat) {
        this.setAdressePat(adressePat);
        return this;
    }

    public void setAdressePat(String adressePat) {
        this.adressePat = adressePat;
    }

    public String getTelephonePat() {
        return this.telephonePat;
    }

    public Patients telephonePat(String telephonePat) {
        this.setTelephonePat(telephonePat);
        return this;
    }

    public void setTelephonePat(String telephonePat) {
        this.telephonePat = telephonePat;
    }

    public String getEmailPat() {
        return this.emailPat;
    }

    public Patients emailPat(String emailPat) {
        this.setEmailPat(emailPat);
        return this;
    }

    public void setEmailPat(String emailPat) {
        this.emailPat = emailPat;
    }

    public String getOriginePat() {
        return this.originePat;
    }

    public Patients originePat(String originePat) {
        this.setOriginePat(originePat);
        return this;
    }

    public void setOriginePat(String originePat) {
        this.originePat = originePat;
    }

    public String getProfessionPat() {
        return this.professionPat;
    }

    public Patients professionPat(String professionPat) {
        this.setProfessionPat(professionPat);
        return this;
    }

    public void setProfessionPat(String professionPat) {
        this.professionPat = professionPat;
    }

    public ZonedDateTime getAgePat() {
        return this.agePat;
    }

    public Patients agePat(ZonedDateTime agePat) {
        this.setAgePat(agePat);
        return this;
    }

    public void setAgePat(ZonedDateTime agePat) {
        this.agePat = agePat;
    }

    public Set<Traitements> getTraitements() {
        return this.traitements;
    }

    public void setTraitements(Set<Traitements> traitements) {
        if (this.traitements != null) {
            this.traitements.forEach(i -> i.setPatient(null));
        }
        if (traitements != null) {
            traitements.forEach(i -> i.setPatient(this));
        }
        this.traitements = traitements;
    }

    public Patients traitements(Set<Traitements> traitements) {
        this.setTraitements(traitements);
        return this;
    }

    public Patients addTraitement(Traitements traitements) {
        this.traitements.add(traitements);
        traitements.setPatient(this);
        return this;
    }

    public Patients removeTraitement(Traitements traitements) {
        this.traitements.remove(traitements);
        traitements.setPatient(null);
        return this;
    }

    public Set<Hospitalisations> getHospitalisations() {
        return this.hospitalisations;
    }

    public void setHospitalisations(Set<Hospitalisations> hospitalisations) {
        if (this.hospitalisations != null) {
            this.hospitalisations.forEach(i -> i.setPatient(null));
        }
        if (hospitalisations != null) {
            hospitalisations.forEach(i -> i.setPatient(this));
        }
        this.hospitalisations = hospitalisations;
    }

    public Patients hospitalisations(Set<Hospitalisations> hospitalisations) {
        this.setHospitalisations(hospitalisations);
        return this;
    }

    public Patients addHospitalisation(Hospitalisations hospitalisations) {
        this.hospitalisations.add(hospitalisations);
        hospitalisations.setPatient(this);
        return this;
    }

    public Patients removeHospitalisation(Hospitalisations hospitalisations) {
        this.hospitalisations.remove(hospitalisations);
        hospitalisations.setPatient(null);
        return this;
    }

    public Set<Consultations> getConsultations() {
        return this.consultations;
    }

    public void setConsultations(Set<Consultations> consultations) {
        if (this.consultations != null) {
            this.consultations.forEach(i -> i.setPatient(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setPatient(this));
        }
        this.consultations = consultations;
    }

    public Patients consultations(Set<Consultations> consultations) {
        this.setConsultations(consultations);
        return this;
    }

    public Patients addConsultation(Consultations consultations) {
        this.consultations.add(consultations);
        consultations.setPatient(this);
        return this;
    }

    public Patients removeConsultation(Consultations consultations) {
        this.consultations.remove(consultations);
        consultations.setPatient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patients)) {
            return false;
        }
        return id != null && id.equals(((Patients) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patients{" +
            "id=" + getId() +
            ", codePat='" + getCodePat() + "'" +
            ", nomPat='" + getNomPat() + "'" +
            ", prenomPat='" + getPrenomPat() + "'" +
            ", sexePat='" + getSexePat() + "'" +
            ", adressePat='" + getAdressePat() + "'" +
            ", telephonePat='" + getTelephonePat() + "'" +
            ", emailPat='" + getEmailPat() + "'" +
            ", originePat='" + getOriginePat() + "'" +
            ", professionPat='" + getProfessionPat() + "'" +
            ", agePat='" + getAgePat() + "'" +
            "}";
    }
}
