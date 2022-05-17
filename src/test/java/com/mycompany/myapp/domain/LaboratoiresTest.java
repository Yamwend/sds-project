package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LaboratoiresTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Laboratoires.class);
        Laboratoires laboratoires1 = new Laboratoires();
        laboratoires1.setId(1L);
        Laboratoires laboratoires2 = new Laboratoires();
        laboratoires2.setId(laboratoires1.getId());
        assertThat(laboratoires1).isEqualTo(laboratoires2);
        laboratoires2.setId(2L);
        assertThat(laboratoires1).isNotEqualTo(laboratoires2);
        laboratoires1.setId(null);
        assertThat(laboratoires1).isNotEqualTo(laboratoires2);
    }
}
