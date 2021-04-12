package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Teatro.
 */
@Entity
@Table(name = "teatro")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Teatro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_teatro")
    private Integer idTeatro;

    @Column(name = "nome_teatro")
    private String nomeTeatro;

    @Column(name = "endereco")
    private String endereco;

    @ManyToOne
    @JsonIgnoreProperties(value = { "teatros" }, allowSetters = true)
    private Cidade cidade;

    @OneToMany(mappedBy = "teatro")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "teatro", "ingressos" }, allowSetters = true)
    private Set<Evento> eventos = new HashSet<>();

    @OneToMany(mappedBy = "teatro")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "teatro" }, allowSetters = true)
    private Set<Assento> assentos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Teatro id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getIdTeatro() {
        return this.idTeatro;
    }

    public Teatro idTeatro(Integer idTeatro) {
        this.idTeatro = idTeatro;
        return this;
    }

    public void setIdTeatro(Integer idTeatro) {
        this.idTeatro = idTeatro;
    }

    public String getNomeTeatro() {
        return this.nomeTeatro;
    }

    public Teatro nomeTeatro(String nomeTeatro) {
        this.nomeTeatro = nomeTeatro;
        return this;
    }

    public void setNomeTeatro(String nomeTeatro) {
        this.nomeTeatro = nomeTeatro;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public Teatro endereco(String endereco) {
        this.endereco = endereco;
        return this;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Cidade getCidade() {
        return this.cidade;
    }

    public Teatro cidade(Cidade cidade) {
        this.setCidade(cidade);
        return this;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }

    public Set<Evento> getEventos() {
        return this.eventos;
    }

    public Teatro eventos(Set<Evento> eventos) {
        this.setEventos(eventos);
        return this;
    }

    public Teatro addEvento(Evento evento) {
        this.eventos.add(evento);
        evento.setTeatro(this);
        return this;
    }

    public Teatro removeEvento(Evento evento) {
        this.eventos.remove(evento);
        evento.setTeatro(null);
        return this;
    }

    public void setEventos(Set<Evento> eventos) {
        if (this.eventos != null) {
            this.eventos.forEach(i -> i.setTeatro(null));
        }
        if (eventos != null) {
            eventos.forEach(i -> i.setTeatro(this));
        }
        this.eventos = eventos;
    }

    public Set<Assento> getAssentos() {
        return this.assentos;
    }

    public Teatro assentos(Set<Assento> assentos) {
        this.setAssentos(assentos);
        return this;
    }

    public Teatro addAssento(Assento assento) {
        this.assentos.add(assento);
        assento.setTeatro(this);
        return this;
    }

    public Teatro removeAssento(Assento assento) {
        this.assentos.remove(assento);
        assento.setTeatro(null);
        return this;
    }

    public void setAssentos(Set<Assento> assentos) {
        if (this.assentos != null) {
            this.assentos.forEach(i -> i.setTeatro(null));
        }
        if (assentos != null) {
            assentos.forEach(i -> i.setTeatro(this));
        }
        this.assentos = assentos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Teatro)) {
            return false;
        }
        return id != null && id.equals(((Teatro) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Teatro{" +
            "id=" + getId() +
            ", idTeatro=" + getIdTeatro() +
            ", nomeTeatro='" + getNomeTeatro() + "'" +
            ", endereco='" + getEndereco() + "'" +
            "}";
    }
}
