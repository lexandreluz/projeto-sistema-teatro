package br.com.ticket.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.ticket.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Assento.class);
        Assento assento1 = new Assento();
        assento1.setId(1L);
        Assento assento2 = new Assento();
        assento2.setId(assento1.getId());
        assertThat(assento1).isEqualTo(assento2);
        assento2.setId(2L);
        assertThat(assento1).isNotEqualTo(assento2);
        assento1.setId(null);
        assertThat(assento1).isNotEqualTo(assento2);
    }
}
