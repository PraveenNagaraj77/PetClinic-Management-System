package com.petclinic.PetClinicBackend.repository;

import com.petclinic.PetClinicBackend.model.Vet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VetRepository extends JpaRepository<Vet, Long> {
}
