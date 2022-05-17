package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Laboratoires;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Laboratoires entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LaboratoiresRepository extends JpaRepository<Laboratoires, Long> {}
