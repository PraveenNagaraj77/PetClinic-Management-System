package com.petclinic.PetClinicBackend.repository;

import com.petclinic.PetClinicBackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    // ✅ Fix: Add @Modifying + @Query for deleting from user_roles
    @Modifying
    @Query(value = "DELETE FROM user_roles WHERE user_id = ?1", nativeQuery = true)
    void deleteRolesByUserId(Long userId);
}
