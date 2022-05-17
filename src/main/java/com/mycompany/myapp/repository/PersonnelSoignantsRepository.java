package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PersonnelSoignants;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PersonnelSoignants entity.
 */
@Repository
public interface PersonnelSoignantsRepository extends JpaRepository<PersonnelSoignants, Long> {
    default Optional<PersonnelSoignants> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<PersonnelSoignants> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<PersonnelSoignants> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct personnelSoignants from PersonnelSoignants personnelSoignants left join fetch personnelSoignants.service",
        countQuery = "select count(distinct personnelSoignants) from PersonnelSoignants personnelSoignants"
    )
    Page<PersonnelSoignants> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct personnelSoignants from PersonnelSoignants personnelSoignants left join fetch personnelSoignants.service")
    List<PersonnelSoignants> findAllWithToOneRelationships();

    @Query(
        "select personnelSoignants from PersonnelSoignants personnelSoignants left join fetch personnelSoignants.service where personnelSoignants.id =:id"
    )
    Optional<PersonnelSoignants> findOneWithToOneRelationships(@Param("id") Long id);
}
