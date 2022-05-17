package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ordonnances.
 */
@Entity
@Table(name = "ordonnances")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ordonnances implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "numero")
    private String numero;

    @OneToMany(mappedBy = "ordonnance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ordonnance" }, allowSetters = true)
    private Set<LigneOrdonnances> lignes = new HashSet<>();

    @OneToMany(mappedBy = "ordonnance")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient", "maladie", "ordonnance", "personnel" }, allowSetters = true)
    private Set<Traitements> ordonners = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ordonnances id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public Ordonnances numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Set<LigneOrdonnances> getLignes() {
        return this.lignes;
    }

    public void setLignes(Set<LigneOrdonnances> ligneOrdonnances) {
        if (this.lignes != null) {
            this.lignes.forEach(i -> i.setOrdonnance(null));
        }
        if (ligneOrdonnances != null) {
            ligneOrdonnances.forEach(i -> i.setOrdonnance(this));
        }
        this.lignes = ligneOrdonnances;
    }

    public Ordonnances lignes(Set<LigneOrdonnances> ligneOrdonnances) {
        this.setLignes(ligneOrdonnances);
        return this;
    }

    public Ordonnances addLigne(LigneOrdonnances ligneOrdonnances) {
        this.lignes.add(ligneOrdonnances);
        ligneOrdonnances.setOrdonnance(this);
        return this;
    }

    public Ordonnances removeLigne(LigneOrdonnances ligneOrdonnances) {
        this.lignes.remove(ligneOrdonnances);
        ligneOrdonnances.setOrdonnance(null);
        return this;
    }

    public Set<Traitements> getOrdonners() {
        return this.ordonners;
    }

    public void setOrdonners(Set<Traitements> traitements) {
        if (this.ordonners != null) {
            this.ordonners.forEach(i -> i.setOrdonnance(null));
        }
        if (traitements != null) {
            traitements.forEach(i -> i.setOrdonnance(this));
        }
        this.ordonners = traitements;
    }

    public Ordonnances ordonners(Set<Traitements> traitements) {
        this.setOrdonners(traitements);
        return this;
    }

    public Ordonnances addOrdonner(Traitements traitements) {
        this.ordonners.add(traitements);
        traitements.setOrdonnance(this);
        return this;
    }

    public Ordonnances removeOrdonner(Traitements traitements) {
        this.ordonners.remove(traitements);
        traitements.setOrdonnance(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ordonnances)) {
            return false;
        }
        return id != null && id.equals(((Ordonnances) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ordonnances{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            "}";
    }
}
