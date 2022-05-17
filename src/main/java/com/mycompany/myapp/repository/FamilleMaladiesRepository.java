package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.FamilleMaladies;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FamilleMaladies entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FamilleMaladiesRepository extends JpaRepository<FamilleMaladies, Long> {}
