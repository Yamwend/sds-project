package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.TypeExams;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the TypeExams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TypeExamsRepository extends JpaRepository<TypeExams, Long> {}
