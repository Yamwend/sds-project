package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrdonnancesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ordonnances.class);
        Ordonnances ordonnances1 = new Ordonnances();
        ordonnances1.setId(1L);
        Ordonnances ordonnances2 = new Ordonnances();
        ordonnances2.setId(ordonnances1.getId());
        assertThat(ordonnances1).isEqualTo(ordonnances2);
        ordonnances2.setId(2L);
        assertThat(ordonnances1).isNotEqualTo(ordonnances2);
        ordonnances1.setId(null);
        assertThat(ordonnances1).isNotEqualTo(ordonnances2);
    }
}
