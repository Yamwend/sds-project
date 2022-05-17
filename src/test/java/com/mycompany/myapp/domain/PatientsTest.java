package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PatientsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Patients.class);
        Patients patients1 = new Patients();
        patients1.setId(1L);
        Patients patients2 = new Patients();
        patients2.setId(patients1.getId());
        assertThat(patients1).isEqualTo(patients2);
        patients2.setId(2L);
        assertThat(patients1).isNotEqualTo(patients2);
        patients1.setId(null);
        assertThat(patients1).isNotEqualTo(patients2);
    }
}
