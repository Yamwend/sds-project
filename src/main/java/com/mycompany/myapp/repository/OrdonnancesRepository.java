package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Ordonnances;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ordonnances entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrdonnancesRepository extends JpaRepository<Ordonnances, Long> {}
