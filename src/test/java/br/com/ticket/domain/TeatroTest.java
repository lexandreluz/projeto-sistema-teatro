package br.com.ticket.domain;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.ticket.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TeatroTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Teatro.class);
        Teatro teatro1 = new Teatro();
        teatro1.setId(1L);
        Teatro teatro2 = new Teatro();
        teatro2.setId(teatro1.getId());
        assertThat(teatro1).isEqualTo(teatro2);
        teatro2.setId(2L);
        assertThat(teatro1).isNotEqualTo(teatro2);
        teatro1.setId(null);
        assertThat(teatro1).isNotEqualTo(teatro2);
    }
}
