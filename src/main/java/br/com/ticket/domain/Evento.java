package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Evento.
 */
@Entity
@Table(name = "evento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Evento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_evento")
    private String idEvento;

    @Column(name = "nome_evento")
    private String nomeEvento;

    @Column(name = "descricao")
    private String descricao;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cidade", "eventos", "assentos" }, allowSetters = true)
    private Teatro teatro;

    @OneToMany(mappedBy = "evento")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "evento", "usuarios" }, allowSetters = true)
    private Set<Ingresso> ingressos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Evento id(Long id) {
        this.id = id;
        return this;
    }

    public String getIdEvento() {
        return this.idEvento;
    }

    public Evento idEvento(String idEvento) {
        this.idEvento = idEvento;
        return this;
    }

    public void setIdEvento(String idEvento) {
        this.idEvento = idEvento;
    }

    public String getNomeEvento() {
        return this.nomeEvento;
    }

    public Evento nomeEvento(String nomeEvento) {
        this.nomeEvento = nomeEvento;
        return this;
    }

    public void setNomeEvento(String nomeEvento) {
        this.nomeEvento = nomeEvento;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Evento descricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Teatro getTeatro() {
        return this.teatro;
    }

    public Evento teatro(Teatro teatro) {
        this.setTeatro(teatro);
        return this;
    }

    public void setTeatro(Teatro teatro) {
        this.teatro = teatro;
    }

    public Set<Ingresso> getIngressos() {
        return this.ingressos;
    }

    public Evento ingressos(Set<Ingresso> ingressos) {
        this.setIngressos(ingressos);
        return this;
    }

    public Evento addIngresso(Ingresso ingresso) {
        this.ingressos.add(ingresso);
        ingresso.setEvento(this);
        return this;
    }

    public Evento removeIngresso(Ingresso ingresso) {
        this.ingressos.remove(ingresso);
        ingresso.setEvento(null);
        return this;
    }

    public void setIngressos(Set<Ingresso> ingressos) {
        if (this.ingressos != null) {
            this.ingressos.forEach(i -> i.setEvento(null));
        }
        if (ingressos != null) {
            ingressos.forEach(i -> i.setEvento(this));
        }
        this.ingressos = ingressos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Evento)) {
            return false;
        }
        return id != null && id.equals(((Evento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Evento{" +
            "id=" + getId() +
            ", idEvento='" + getIdEvento() + "'" +
            ", nomeEvento='" + getNomeEvento() + "'" +
            ", descricao='" + getDescricao() + "'" +
            "}";
    }
}
