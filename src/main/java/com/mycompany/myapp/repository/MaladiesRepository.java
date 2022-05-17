package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Maladies;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Maladies entity.
 */
@Repository
public interface MaladiesRepository extends JpaRepository<Maladies, Long> {
    default Optional<Maladies> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Maladies> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Maladies> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct maladies from Maladies maladies left join fetch maladies.famille",
        countQuery = "select count(distinct maladies) from Maladies maladies"
    )
    Page<Maladies> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct maladies from Maladies maladies left join fetch maladies.famille")
    List<Maladies> findAllWithToOneRelationships();

    @Query("select maladies from Maladies maladies left join fetch maladies.famille where maladies.id =:id")
    Optional<Maladies> findOneWithToOneRelationships(@Param("id") Long id);
}
