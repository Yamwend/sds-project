package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Patients;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Patients entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientsRepository extends JpaRepository<Patients, Long> {}
