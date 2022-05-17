package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HospitalisationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Hospitalisations.class);
        Hospitalisations hospitalisations1 = new Hospitalisations();
        hospitalisations1.setId(1L);
        Hospitalisations hospitalisations2 = new Hospitalisations();
        hospitalisations2.setId(hospitalisations1.getId());
        assertThat(hospitalisations1).isEqualTo(hospitalisations2);
        hospitalisations2.setId(2L);
        assertThat(hospitalisations1).isNotEqualTo(hospitalisations2);
        hospitalisations1.setId(null);
        assertThat(hospitalisations1).isNotEqualTo(hospitalisations2);
    }
}
