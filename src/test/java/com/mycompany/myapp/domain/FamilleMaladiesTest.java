package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FamilleMaladiesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FamilleMaladies.class);
        FamilleMaladies familleMaladies1 = new FamilleMaladies();
        familleMaladies1.setId(1L);
        FamilleMaladies familleMaladies2 = new FamilleMaladies();
        familleMaladies2.setId(familleMaladies1.getId());
        assertThat(familleMaladies1).isEqualTo(familleMaladies2);
        familleMaladies2.setId(2L);
        assertThat(familleMaladies1).isNotEqualTo(familleMaladies2);
        familleMaladies1.setId(null);
        assertThat(familleMaladies1).isNotEqualTo(familleMaladies2);
    }
}
