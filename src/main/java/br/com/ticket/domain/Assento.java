package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Assento.
 */
@Entity
@Table(name = "assento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Assento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "numeracao")
    private Integer numeracao;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cidade", "eventos", "assentos" }, allowSetters = true)
    private Teatro teatro;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assento id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getNumeracao() {
        return this.numeracao;
    }

    public Assento numeracao(Integer numeracao) {
        this.numeracao = numeracao;
        return this;
    }

    public void setNumeracao(Integer numeracao) {
        this.numeracao = numeracao;
    }

    public Boolean getStatus() {
        return this.status;
    }

    public Assento status(Boolean status) {
        this.status = status;
        return this;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Teatro getTeatro() {
        return this.teatro;
    }

    public Assento teatro(Teatro teatro) {
        this.setTeatro(teatro);
        return this;
    }

    public void setTeatro(Teatro teatro) {
        this.teatro = teatro;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Assento)) {
            return false;
        }
        return id != null && id.equals(((Assento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Assento{" +
            "id=" + getId() +
            ", numeracao=" + getNumeracao() +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
