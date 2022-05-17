package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Hospitalisations;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Hospitalisations entity.
 */
@Repository
public interface HospitalisationsRepository extends JpaRepository<Hospitalisations, Long> {
    default Optional<Hospitalisations> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Hospitalisations> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Hospitalisations> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct hospitalisations from Hospitalisations hospitalisations left join fetch hospitalisations.chambre left join fetch hospitalisations.patient",
        countQuery = "select count(distinct hospitalisations) from Hospitalisations hospitalisations"
    )
    Page<Hospitalisations> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct hospitalisations from Hospitalisations hospitalisations left join fetch hospitalisations.chambre left join fetch hospitalisations.patient"
    )
    List<Hospitalisations> findAllWithToOneRelationships();

    @Query(
        "select hospitalisations from Hospitalisations hospitalisations left join fetch hospitalisations.chambre left join fetch hospitalisations.patient where hospitalisations.id =:id"
    )
    Optional<Hospitalisations> findOneWithToOneRelationships(@Param("id") Long id);
}
