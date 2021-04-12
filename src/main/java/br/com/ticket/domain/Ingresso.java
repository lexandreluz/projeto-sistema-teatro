package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ingresso.
 */
@Entity
@Table(name = "ingresso")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Ingresso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_ingresso")
    private Integer idIngresso;

    @Column(name = "data_compra")
    private ZonedDateTime dataCompra;

    @Column(name = "valor")
    private Double valor;

    @ManyToOne
    @JsonIgnoreProperties(value = { "teatro", "ingressos" }, allowSetters = true)
    private Evento evento;

    @OneToMany(mappedBy = "ingresso")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ingresso" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ingresso id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getIdIngresso() {
        return this.idIngresso;
    }

    public Ingresso idIngresso(Integer idIngresso) {
        this.idIngresso = idIngresso;
        return this;
    }

    public void setIdIngresso(Integer idIngresso) {
        this.idIngresso = idIngresso;
    }

    public ZonedDateTime getDataCompra() {
        return this.dataCompra;
    }

    public Ingresso dataCompra(ZonedDateTime dataCompra) {
        this.dataCompra = dataCompra;
        return this;
    }

    public void setDataCompra(ZonedDateTime dataCompra) {
        this.dataCompra = dataCompra;
    }

    public Double getValor() {
        return this.valor;
    }

    public Ingresso valor(Double valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Evento getEvento() {
        return this.evento;
    }

    public Ingresso evento(Evento evento) {
        this.setEvento(evento);
        return this;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public Ingresso usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Ingresso addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.setIngresso(this);
        return this;
    }

    public Ingresso removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.setIngresso(null);
        return this;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.setIngresso(null));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.setIngresso(this));
        }
        this.usuarios = usuarios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ingresso)) {
            return false;
        }
        return id != null && id.equals(((Ingresso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ingresso{" +
            "id=" + getId() +
            ", idIngresso=" + getIdIngresso() +
            ", dataCompra='" + getDataCompra() + "'" +
            ", valor=" + getValor() +
            "}";
    }
}
