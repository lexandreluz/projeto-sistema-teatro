package br.com.ticket.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Usuario.
 */
@Entity
@Table(name = "usuario")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nome")
    private String nome;

    @Column(name = "cpf")
    private String cpf;

    @ManyToOne
    @JsonIgnoreProperties(value = { "evento", "usuarios" }, allowSetters = true)
    private Ingresso ingresso;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public Usuario idUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
        return this;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return this.nome;
    }

    public Usuario nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return this.cpf;
    }

    public Usuario cpf(String cpf) {
        this.cpf = cpf;
        return this;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Ingresso getIngresso() {
        return this.ingresso;
    }

    public Usuario ingresso(Ingresso ingresso) {
        this.setIngresso(ingresso);
        return this;
    }

    public void setIngresso(Ingresso ingresso) {
        this.ingresso = ingresso;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return id != null && id.equals(((Usuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", idUsuario=" + getIdUsuario() +
            ", nome='" + getNome() + "'" +
            ", cpf='" + getCpf() + "'" +
            "}";
    }
}
