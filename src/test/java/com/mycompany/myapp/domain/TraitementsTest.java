package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TraitementsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Traitements.class);
        Traitements traitements1 = new Traitements();
        traitements1.setId(1L);
        Traitements traitements2 = new Traitements();
        traitements2.setId(traitements1.getId());
        assertThat(traitements1).isEqualTo(traitements2);
        traitements2.setId(2L);
        assertThat(traitements1).isNotEqualTo(traitements2);
        traitements1.setId(null);
        assertThat(traitements1).isNotEqualTo(traitements2);
    }
}
