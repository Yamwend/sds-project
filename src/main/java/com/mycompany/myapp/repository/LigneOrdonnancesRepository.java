package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LigneOrdonnances;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LigneOrdonnances entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LigneOrdonnancesRepository extends JpaRepository<LigneOrdonnances, Long> {}
