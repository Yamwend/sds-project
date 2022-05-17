package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CategorieChambresTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategorieChambres.class);
        CategorieChambres categorieChambres1 = new CategorieChambres();
        categorieChambres1.setId(1L);
        CategorieChambres categorieChambres2 = new CategorieChambres();
        categorieChambres2.setId(categorieChambres1.getId());
        assertThat(categorieChambres1).isEqualTo(categorieChambres2);
        categorieChambres2.setId(2L);
        assertThat(categorieChambres1).isNotEqualTo(categorieChambres2);
        categorieChambres1.setId(null);
        assertThat(categorieChambres1).isNotEqualTo(categorieChambres2);
    }
}
