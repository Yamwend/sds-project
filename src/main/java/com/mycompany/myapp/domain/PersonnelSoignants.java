package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Grade;
import com.mycompany.myapp.domain.enumeration.Sexe;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A PersonnelSoignants.
 */
@Entity
@Table(name = "personnel_soignants")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PersonnelSoignants implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code_personne")
    private String codePersonne;

    @Column(name = "nom_personne")
    private String nomPersonne;

    @Column(name = "prenom_personne")
    private String prenomPersonne;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade_personne")
    private Grade gradePersonne;

    @Column(name = "fonction_personne")
    private String fonctionPersonne;

    @Column(name = "telphone_personne")
    private String telphonePersonne;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_personne")
    private Sexe emailPersonne;

    @Column(name = "adresse_personne")
    private String adressePersonne;

    @Column(name = "date_de_naiss_personne")
    private ZonedDateTime dateDeNaissPersonne;

    @OneToMany(mappedBy = "personnel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "maladie", "ordonnance", "personnel" }, allowSetters = true)
    private Set<Traitements> proposers = new HashSet<>();

    @OneToMany(mappedBy = "personnel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "personnel", "examen" }, allowSetters = true)
    private Set<Consultations> consulters = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "services" }, allowSetters = true)
    private Services service;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PersonnelSoignants id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodePersonne() {
        return this.codePersonne;
    }

    public PersonnelSoignants codePersonne(String codePersonne) {
        this.setCodePersonne(codePersonne);
        return this;
    }

    public void setCodePersonne(String codePersonne) {
        this.codePersonne = codePersonne;
    }

    public String getNomPersonne() {
        return this.nomPersonne;
    }

    public PersonnelSoignants nomPersonne(String nomPersonne) {
        this.setNomPersonne(nomPersonne);
        return this;
    }

    public void setNomPersonne(String nomPersonne) {
        this.nomPersonne = nomPersonne;
    }

    public String getPrenomPersonne() {
        return this.prenomPersonne;
    }

    public PersonnelSoignants prenomPersonne(String prenomPersonne) {
        this.setPrenomPersonne(prenomPersonne);
        return this;
    }

    public void setPrenomPersonne(String prenomPersonne) {
        this.prenomPersonne = prenomPersonne;
    }

    public Grade getGradePersonne() {
        return this.gradePersonne;
    }

    public PersonnelSoignants gradePersonne(Grade gradePersonne) {
        this.setGradePersonne(gradePersonne);
        return this;
    }

    public void setGradePersonne(Grade gradePersonne) {
        this.gradePersonne = gradePersonne;
    }

    public String getFonctionPersonne() {
        return this.fonctionPersonne;
    }

    public PersonnelSoignants fonctionPersonne(String fonctionPersonne) {
        this.setFonctionPersonne(fonctionPersonne);
        return this;
    }

    public void setFonctionPersonne(String fonctionPersonne) {
        this.fonctionPersonne = fonctionPersonne;
    }

    public String getTelphonePersonne() {
        return this.telphonePersonne;
    }

    public PersonnelSoignants telphonePersonne(String telphonePersonne) {
        this.setTelphonePersonne(telphonePersonne);
        return this;
    }

    public void setTelphonePersonne(String telphonePersonne) {
        this.telphonePersonne = telphonePersonne;
    }

    public Sexe getEmailPersonne() {
        return this.emailPersonne;
    }

    public PersonnelSoignants emailPersonne(Sexe emailPersonne) {
        this.setEmailPersonne(emailPersonne);
        return this;
    }

    public void setEmailPersonne(Sexe emailPersonne) {
        this.emailPersonne = emailPersonne;
    }

    public String getAdressePersonne() {
        return this.adressePersonne;
    }

    public PersonnelSoignants adressePersonne(String adressePersonne) {
        this.setAdressePersonne(adressePersonne);
        return this;
    }

    public void setAdressePersonne(String adressePersonne) {
        this.adressePersonne = adressePersonne;
    }

    public ZonedDateTime getDateDeNaissPersonne() {
        return this.dateDeNaissPersonne;
    }

    public PersonnelSoignants dateDeNaissPersonne(ZonedDateTime dateDeNaissPersonne) {
        this.setDateDeNaissPersonne(dateDeNaissPersonne);
        return this;
    }

    public void setDateDeNaissPersonne(ZonedDateTime dateDeNaissPersonne) {
        this.dateDeNaissPersonne = dateDeNaissPersonne;
    }

    public Set<Traitements> getProposers() {
        return this.proposers;
    }

    public void setProposers(Set<Traitements> traitements) {
        if (this.proposers != null) {
            this.proposers.forEach(i -> i.setPersonnel(null));
        }
        if (traitements != null) {
            traitements.forEach(i -> i.setPersonnel(this));
        }
        this.proposers = traitements;
    }

    public PersonnelSoignants proposers(Set<Traitements> traitements) {
        this.setProposers(traitements);
        return this;
    }

    public PersonnelSoignants addProposer(Traitements traitements) {
        this.proposers.add(traitements);
        traitements.setPersonnel(this);
        return this;
    }

    public PersonnelSoignants removeProposer(Traitements traitements) {
        this.proposers.remove(traitements);
        traitements.setPersonnel(null);
        return this;
    }

    public Set<Consultations> getConsulters() {
        return this.consulters;
    }

    public void setConsulters(Set<Consultations> consultations) {
        if (this.consulters != null) {
            this.consulters.forEach(i -> i.setPersonnel(null));
        }
        if (consultations != null) {
            consultations.forEach(i -> i.setPersonnel(this));
        }
        this.consulters = consultations;
    }

    public PersonnelSoignants consulters(Set<Consultations> consultations) {
        this.setConsulters(consultations);
        return this;
    }

    public PersonnelSoignants addConsulter(Consultations consultations) {
        this.consulters.add(consultations);
        consultations.setPersonnel(this);
        return this;
    }

    public PersonnelSoignants removeConsulter(Consultations consultations) {
        this.consulters.remove(consultations);
        consultations.setPersonnel(null);
        return this;
    }

    public Services getService() {
        return this.service;
    }

    public void setService(Services services) {
        this.service = services;
    }

    public PersonnelSoignants service(Services services) {
        this.setService(services);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PersonnelSoignants)) {
            return false;
        }
        return id != null && id.equals(((PersonnelSoignants) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonnelSoignants{" +
            "id=" + getId() +
            ", codePersonne='" + getCodePersonne() + "'" +
            ", nomPersonne='" + getNomPersonne() + "'" +
            ", prenomPersonne='" + getPrenomPersonne() + "'" +
            ", gradePersonne='" + getGradePersonne() + "'" +
            ", fonctionPersonne='" + getFonctionPersonne() + "'" +
            ", telphonePersonne='" + getTelphonePersonne() + "'" +
            ", emailPersonne='" + getEmailPersonne() + "'" +
            ", adressePersonne='" + getAdressePersonne() + "'" +
            ", dateDeNaissPersonne='" + getDateDeNaissPersonne() + "'" +
            "}";
    }
}
