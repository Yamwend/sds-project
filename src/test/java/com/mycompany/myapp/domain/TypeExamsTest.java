package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeExamsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeExams.class);
        TypeExams typeExams1 = new TypeExams();
        typeExams1.setId(1L);
        TypeExams typeExams2 = new TypeExams();
        typeExams2.setId(typeExams1.getId());
        assertThat(typeExams1).isEqualTo(typeExams2);
        typeExams2.setId(2L);
        assertThat(typeExams1).isNotEqualTo(typeExams2);
        typeExams1.setId(null);
        assertThat(typeExams1).isNotEqualTo(typeExams2);
    }
}
