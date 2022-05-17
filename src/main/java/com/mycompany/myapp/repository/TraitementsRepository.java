package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Traitements;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Traitements entity.
 */
@Repository
public interface TraitementsRepository extends JpaRepository<Traitements, Long> {
    default Optional<Traitements> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Traitements> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Traitements> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct traitements from Traitements traitements left join fetch traitements.patient left join fetch traitements.maladie left join fetch traitements.ordonnance left join fetch traitements.personnel",
        countQuery = "select count(distinct traitements) from Traitements traitements"
    )
    Page<Traitements> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct traitements from Traitements traitements left join fetch traitements.patient left join fetch traitements.maladie left join fetch traitements.ordonnance left join fetch traitements.personnel"
    )
    List<Traitements> findAllWithToOneRelationships();

    @Query(
        "select traitements from Traitements traitements left join fetch traitements.patient left join fetch traitements.maladie left join fetch traitements.ordonnance left join fetch traitements.personnel where traitements.id =:id"
    )
    Optional<Traitements> findOneWithToOneRelationships(@Param("id") Long id);
}
