package com.petclinic.PetClinicBackend.service;

import com.petclinic.PetClinicBackend.config.SecurityUtil;
import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Owner;
import com.petclinic.PetClinicBackend.model.Pet;
import com.petclinic.PetClinicBackend.model.Visit;
import com.petclinic.PetClinicBackend.repository.OwnerRepository;
import com.petclinic.PetClinicBackend.repository.PetRepository;
import com.petclinic.PetClinicBackend.repository.VisitRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PetService {

    private static final Logger logger = LoggerFactory.getLogger(PetService.class);

    private final PetRepository petRepository;
    private final OwnerRepository ownerRepository;
    private final VisitRepository visitRepository;

    public PetService(PetRepository petRepository, OwnerRepository ownerRepository, VisitRepository visitRepository) {
        this.petRepository = petRepository;
        this.ownerRepository = ownerRepository;
        this.visitRepository = visitRepository;
    }

    public List<Pet> getAllPets() {
        if (!SecurityUtil.hasRole("ADMIN") && !SecurityUtil.hasRole("SUPERADMIN")) {
            logger.warn("Unauthorized access attempt to fetch all pets");
            throw new AccessDeniedException("Only admins can view all pets");
        }
        logger.info("Fetching all pets for admin user");
        return petRepository.findAll();
    }

    public List<Pet> getPetsByOwnerId(Long ownerId) {
        validateOwnershipOrAdmin(ownerId);
        logger.info("Fetching pets for owner with ID {}", ownerId);
        return petRepository.findByOwnerId(ownerId);
    }

    public Pet getPetById(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", petId));
        validateOwnershipOrAdmin(pet.getOwner().getId());
        logger.info("Fetching pet with ID {}", petId);
        return pet;
    }

    @Transactional
    public Pet createPet(Long ownerId, Pet pet) {
        validateOwnershipOrAdmin(ownerId);
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", ownerId));
        pet.setOwner(owner);
        Pet savedPet = petRepository.save(pet);
        logger.info("Created new pet with ID {} for owner {}", savedPet.getId(), ownerId);
        return savedPet;
    }

    @Transactional
    public Pet updatePet(Long petId, Pet updatedPet) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", petId));
        validateOwnershipOrAdmin(pet.getOwner().getId());

        if (updatedPet.getName() != null) pet.setName(updatedPet.getName());
        if (updatedPet.getBreed() != null) pet.setBreed(updatedPet.getBreed());
        if (updatedPet.getBirthDate() != null) pet.setBirthDate(updatedPet.getBirthDate());

        Pet savedPet = petRepository.save(pet);
        logger.info("Updated pet with ID {}", savedPet.getId());
        return savedPet;
    }

    @Transactional
    public void deletePet(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", "id", id));
        validateOwnershipOrAdmin(pet.getOwner().getId());
        petRepository.deleteById(id);
        logger.info("Deleted pet with ID {}", id);
    }

    private void validateOwnershipOrAdmin(Long ownerId) {
        String currentUsername = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", "unknown"));

        logger.info("Current user trying to access: {}", currentUsername);

        boolean isAdmin = SecurityUtil.hasRole("ADMIN") || SecurityUtil.hasRole("SUPERADMIN");

        if (!isAdmin) {
            Owner currentOwner = ownerRepository.findByUser_Email(currentUsername)
                    .orElseThrow(() -> new ResourceNotFoundException("Owner", "email", currentUsername));

            if (!currentOwner.getId().equals(ownerId)) {
                logger.warn("Access denied for user {}: not owner of pet", currentUsername);
                throw new AccessDeniedException("Access denied: You can only access your own pets.");
            }
        }
    }

    public boolean isPetOwnedByUser(Long petId, String username) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

        if (pet.getOwner() == null || pet.getOwner().getUser() == null) {
            return false;
        }

        return username.equals(pet.getOwner().getUser().getEmail());
    }

    public boolean isOwnerOwnedByUser(Long ownerId, String username) {
        Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", ownerId));
        return owner.getUser().getEmail().equals(username);
    }

    public List<Pet> getMyPets() {
        String currentUsername = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", "unknown"));

        Owner owner = ownerRepository.findByUser_Email(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "email", currentUsername));

        logger.info("Fetching pets for logged-in user {}", currentUsername);
        return petRepository.findByOwnerId(owner.getId());
    }

    public List<Visit> getMyVisits() {
        String currentUsername = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", "unknown"));

        Owner owner = ownerRepository.findByUser_Email(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "email", currentUsername));

        logger.info("Fetching visits for pets owned by user {}", currentUsername);
        return visitRepository.findByPet_Owner_Id(owner.getId());
    }
}
