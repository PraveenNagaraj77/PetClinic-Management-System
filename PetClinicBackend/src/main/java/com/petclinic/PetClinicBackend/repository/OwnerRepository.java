package com.petclinic.PetClinicBackend.repository;

import com.petclinic.PetClinicBackend.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {

    // 🔹 Used during registration and profile lookup
    Optional<Owner> findByEmail(String email);
    boolean existsByEmail(String email);

    // 🔹 Used in SecurityUtil-based lookups and OwnerController
    Optional<Owner> findByUser_Email(String email);
    boolean existsByUser_Email(String email);

    // 🔹 Used in fallback lookups via userId
    Optional<Owner> findByUser_Id(Long userId);

    // 🔹 Useful for dashboards and admin filters
    @Query("SELECT o FROM Owner o JOIN o.user u JOIN u.roles r WHERE r.name = 'ROLE_USER'")
    List<Owner> findAllOwnersWithUserRole();

    @Query("SELECT o FROM Owner o JOIN o.user u JOIN u.roles r WHERE r.name = 'ROLE_SUPERADMIN'")
    List<Owner> findAllOwnersWithSuperAdminRole();
}
