package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MaladiesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Maladies.class);
        Maladies maladies1 = new Maladies();
        maladies1.setId(1L);
        Maladies maladies2 = new Maladies();
        maladies2.setId(maladies1.getId());
        assertThat(maladies1).isEqualTo(maladies2);
        maladies2.setId(2L);
        assertThat(maladies1).isNotEqualTo(maladies2);
        maladies1.setId(null);
        assertThat(maladies1).isNotEqualTo(maladies2);
    }
}
