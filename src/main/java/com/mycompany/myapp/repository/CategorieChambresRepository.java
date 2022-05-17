package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CategorieChambres;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the CategorieChambres entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategorieChambresRepository extends JpaRepository<CategorieChambres, Long> {}
