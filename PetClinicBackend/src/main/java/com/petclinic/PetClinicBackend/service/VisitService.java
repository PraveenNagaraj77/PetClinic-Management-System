package com.petclinic.PetClinicBackend.service;

import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Pet;
import com.petclinic.PetClinicBackend.model.User;
import com.petclinic.PetClinicBackend.model.Vet;
import com.petclinic.PetClinicBackend.model.Visit;
import com.petclinic.PetClinicBackend.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final PetRepository petRepository;
    private final VetRepository vetRepository;
    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;

    public VisitService(
            VisitRepository visitRepository,
            PetRepository petRepository,
            VetRepository vetRepository,
            UserRepository userRepository,
            OwnerRepository ownerRepository
    ) {
        this.visitRepository = visitRepository;
        this.petRepository = petRepository;
        this.vetRepository = vetRepository;
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
    }

    // ✅ Save or update visit
    public Visit saveVisit(Visit visit) {
        Long petId = visit.getPet().getId();
        Long vetId = visit.getVet().getId();

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", petId));
        Vet vet = vetRepository.findById(vetId)
                .orElseThrow(() -> new ResourceNotFoundException("Vet", "id", vetId));

        visit.setPet(pet);
        visit.setVet(vet);

        return visitRepository.save(visit);
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    public List<Visit> getVisitsByPetId(Long petId) {
        return visitRepository.findByPetId(petId);
    }

    public Optional<Visit> getVisitById(Long id) {
        return visitRepository.findById(id);
    }

    public void deleteVisit(Long id) {
        if (!visitRepository.existsById(id)) {
            throw new ResourceNotFoundException("Visit", "id", id);
        }
        visitRepository.deleteById(id);
    }

    // ✅ Simplified using derived query method
    public List<Visit> getVisitsForCurrentUser(String email) {
        return visitRepository.findAllByPet_Owner_User_Email(email);
    }

    public Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", id));
    }

    public Vet getVetById(Long id) {
        return vetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vet", "id", id));
    }
}
