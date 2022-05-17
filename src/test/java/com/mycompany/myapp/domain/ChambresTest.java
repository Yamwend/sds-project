package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChambresTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chambres.class);
        Chambres chambres1 = new Chambres();
        chambres1.setId(1L);
        Chambres chambres2 = new Chambres();
        chambres2.setId(chambres1.getId());
        assertThat(chambres1).isEqualTo(chambres2);
        chambres2.setId(2L);
        assertThat(chambres1).isNotEqualTo(chambres2);
        chambres1.setId(null);
        assertThat(chambres1).isNotEqualTo(chambres2);
    }
}
