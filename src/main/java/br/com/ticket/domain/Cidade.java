package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Cidade.
 */
@Entity
@Table(name = "cidade")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Cidade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome_cidade")
    private String nomeCidade;

    @Column(name = "uf")
    private String uf;

    @OneToMany(mappedBy = "cidade")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cidade", "eventos", "assentos" }, allowSetters = true)
    private Set<Teatro> teatros = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cidade id(Long id) {
        this.id = id;
        return this;
    }

    public String getNomeCidade() {
        return this.nomeCidade;
    }

    public Cidade nomeCidade(String nomeCidade) {
        this.nomeCidade = nomeCidade;
        return this;
    }

    public void setNomeCidade(String nomeCidade) {
        this.nomeCidade = nomeCidade;
    }

    public String getUf() {
        return this.uf;
    }

    public Cidade uf(String uf) {
        this.uf = uf;
        return this;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public Set<Teatro> getTeatros() {
        return this.teatros;
    }

    public Cidade teatros(Set<Teatro> teatros) {
        this.setTeatros(teatros);
        return this;
    }

    public Cidade addTeatro(Teatro teatro) {
        this.teatros.add(teatro);
        teatro.setCidade(this);
        return this;
    }

    public Cidade removeTeatro(Teatro teatro) {
        this.teatros.remove(teatro);
        teatro.setCidade(null);
        return this;
    }

    public void setTeatros(Set<Teatro> teatros) {
        if (this.teatros != null) {
            this.teatros.forEach(i -> i.setCidade(null));
        }
        if (teatros != null) {
            teatros.forEach(i -> i.setCidade(this));
        }
        this.teatros = teatros;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cidade)) {
            return false;
        }
        return id != null && id.equals(((Cidade) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cidade{" +
            "id=" + getId() +
            ", nomeCidade='" + getNomeCidade() + "'" +
            ", uf='" + getUf() + "'" +
            "}";
    }
}
