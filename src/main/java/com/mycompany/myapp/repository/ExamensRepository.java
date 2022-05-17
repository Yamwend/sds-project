package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Examens;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Examens entity.
 */
@Repository
public interface ExamensRepository extends JpaRepository<Examens, Long> {
    default Optional<Examens> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Examens> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Examens> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct examens from Examens examens left join fetch examens.typeExam left join fetch examens.laboratoire",
        countQuery = "select count(distinct examens) from Examens examens"
    )
    Page<Examens> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct examens from Examens examens left join fetch examens.typeExam left join fetch examens.laboratoire")
    List<Examens> findAllWithToOneRelationships();

    @Query("select examens from Examens examens left join fetch examens.typeExam left join fetch examens.laboratoire where examens.id =:id")
    Optional<Examens> findOneWithToOneRelationships(@Param("id") Long id);
}
