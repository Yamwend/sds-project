package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Chambres;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Chambres entity.
 */
@Repository
public interface ChambresRepository extends JpaRepository<Chambres, Long> {
    default Optional<Chambres> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Chambres> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Chambres> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct chambres from Chambres chambres left join fetch chambres.categorie",
        countQuery = "select count(distinct chambres) from Chambres chambres"
    )
    Page<Chambres> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct chambres from Chambres chambres left join fetch chambres.categorie")
    List<Chambres> findAllWithToOneRelationships();

    @Query("select chambres from Chambres chambres left join fetch chambres.categorie where chambres.id =:id")
    Optional<Chambres> findOneWithToOneRelationships(@Param("id") Long id);
}
