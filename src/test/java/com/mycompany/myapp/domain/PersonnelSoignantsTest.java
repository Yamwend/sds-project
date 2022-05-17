package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PersonnelSoignantsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PersonnelSoignants.class);
        PersonnelSoignants personnelSoignants1 = new PersonnelSoignants();
        personnelSoignants1.setId(1L);
        PersonnelSoignants personnelSoignants2 = new PersonnelSoignants();
        personnelSoignants2.setId(personnelSoignants1.getId());
        assertThat(personnelSoignants1).isEqualTo(personnelSoignants2);
        personnelSoignants2.setId(2L);
        assertThat(personnelSoignants1).isNotEqualTo(personnelSoignants2);
        personnelSoignants1.setId(null);
        assertThat(personnelSoignants1).isNotEqualTo(personnelSoignants2);
    }
}
