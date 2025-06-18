package com.petclinic.PetClinicBackend.repository;

import com.petclinic.PetClinicBackend.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    // 🔍 Find visits by Pet ID
    List<Visit> findByPetId(Long petId);

    // 🔍 Find visits by Owner ID (used elsewhere)
    List<Visit> findByPet_Owner_Id(Long ownerId);

    List<Visit> findAllByPet_Owner_User_Email(String email); // <- match with how users are saved
}
