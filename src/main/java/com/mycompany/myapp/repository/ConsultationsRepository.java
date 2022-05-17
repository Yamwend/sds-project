package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Consultations;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consultations entity.
 */
@Repository
public interface ConsultationsRepository extends JpaRepository<Consultations, Long> {
    default Optional<Consultations> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Consultations> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Consultations> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct consultations from Consultations consultations left join fetch consultations.patient left join fetch consultations.personnel left join fetch consultations.examen",
        countQuery = "select count(distinct consultations) from Consultations consultations"
    )
    Page<Consultations> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct consultations from Consultations consultations left join fetch consultations.patient left join fetch consultations.personnel left join fetch consultations.examen"
    )
    List<Consultations> findAllWithToOneRelationships();

    @Query(
        "select consultations from Consultations consultations left join fetch consultations.patient left join fetch consultations.personnel left join fetch consultations.examen where consultations.id =:id"
    )
    Optional<Consultations> findOneWithToOneRelationships(@Param("id") Long id);
}
