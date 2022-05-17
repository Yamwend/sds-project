package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ExamensTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Examens.class);
        Examens examens1 = new Examens();
        examens1.setId(1L);
        Examens examens2 = new Examens();
        examens2.setId(examens1.getId());
        assertThat(examens1).isEqualTo(examens2);
        examens2.setId(2L);
        assertThat(examens1).isNotEqualTo(examens2);
        examens1.setId(null);
        assertThat(examens1).isNotEqualTo(examens2);
    }
}
