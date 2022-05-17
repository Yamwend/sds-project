package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsultationsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Consultations.class);
        Consultations consultations1 = new Consultations();
        consultations1.setId(1L);
        Consultations consultations2 = new Consultations();
        consultations2.setId(consultations1.getId());
        assertThat(consultations1).isEqualTo(consultations2);
        consultations2.setId(2L);
        assertThat(consultations1).isNotEqualTo(consultations2);
        consultations1.setId(null);
        assertThat(consultations1).isNotEqualTo(consultations2);
    }
}
