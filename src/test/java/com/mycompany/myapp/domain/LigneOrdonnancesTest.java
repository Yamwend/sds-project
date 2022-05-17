package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LigneOrdonnancesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LigneOrdonnances.class);
        LigneOrdonnances ligneOrdonnances1 = new LigneOrdonnances();
        ligneOrdonnances1.setId(1L);
        LigneOrdonnances ligneOrdonnances2 = new LigneOrdonnances();
        ligneOrdonnances2.setId(ligneOrdonnances1.getId());
        assertThat(ligneOrdonnances1).isEqualTo(ligneOrdonnances2);
        ligneOrdonnances2.setId(2L);
        assertThat(ligneOrdonnances1).isNotEqualTo(ligneOrdonnances2);
        ligneOrdonnances1.setId(null);
        assertThat(ligneOrdonnances1).isNotEqualTo(ligneOrdonnances2);
    }
}
