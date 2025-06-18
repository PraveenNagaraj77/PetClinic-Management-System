package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.config.SecurityUtil;
import com.petclinic.PetClinicBackend.dto.PetResponseDTO;
import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Pet;
import com.petclinic.PetClinicBackend.service.PetService;
import com.petclinic.PetClinicBackend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private static final Logger logger = LoggerFactory.getLogger(PetController.class);

    private final PetService petService;
    private final UserService userService;

    public PetController(PetService petService, UserService userService) {
        this.petService = petService;
        this.userService = userService;
    }

    // ✅ Get pets for currently logged-in user (must come before /{id})
    @GetMapping("/mine")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<PetResponseDTO>> getMyPets() {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        logger.info("Fetching pets for currently logged-in user: {}", username);
        List<Pet> pets = petService.getMyPets();
        List<PetResponseDTO> response = pets.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Admins & SuperAdmins can view all pets
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<PetResponseDTO>> getAllPets() {
        logger.info("Fetching all pets by admin/superadmin");
        List<Pet> pets = petService.getAllPets();
        List<PetResponseDTO> response = pets.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ Users can view their own pets; Admins can view any
    @GetMapping("/owner/{ownerId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<PetResponseDTO>> getPetsByOwner(@PathVariable Long ownerId) {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        if (userService.isCurrentUserOwnerOf(ownerId, username) || userService.isAdmin(username)) {
            logger.info("Fetching pets for owner ID {}", ownerId);
            List<Pet> pets = petService.getPetsByOwnerId(ownerId);
            List<PetResponseDTO> response = pets.stream().map(this::mapToDTO).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } else {
            throw new ResourceNotFoundException("Unauthorized to view these pets", "ownerId", ownerId);
        }
    }

    // ✅ User can view their own pet by pet ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<PetResponseDTO> getPetById(@PathVariable Long id) {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        if (petService.isPetOwnedByUser(id, username) || userService.isAdmin(username)) {
            logger.info("Fetching pet with ID {}", id);
            Pet pet = petService.getPetById(id);
            return ResponseEntity.ok(mapToDTO(pet));
        } else {
            throw new ResourceNotFoundException("Unauthorized to view this pet", "petId", id);
        }
    }

    // ✅ User/Admin can create a pet under their ownership
    @PostMapping("/owner/{ownerId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<PetResponseDTO> createPet(@PathVariable Long ownerId, @RequestBody Pet pet) {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        if (userService.isCurrentUserOwnerOf(ownerId, username) || userService.isAdmin(username)) {
            logger.info("Creating pet for owner ID {}", ownerId);
            Pet createdPet = petService.createPet(ownerId, pet);
            return ResponseEntity.ok(mapToDTO(createdPet));
        } else {
            throw new ResourceNotFoundException("Unauthorized to create pet for this owner", "ownerId", ownerId);
        }
    }

    // ✅ User/Admin can update only their own pets
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<PetResponseDTO> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        if (petService.isPetOwnedByUser(id, username) || userService.isAdmin(username)) {
            logger.info("Updating pet with ID {}", id);
            Pet updatedPet = petService.updatePet(id, pet);
            return ResponseEntity.ok(mapToDTO(updatedPet));
        } else {
            throw new ResourceNotFoundException("Unauthorized to update this pet", "petId", id);
        }
    }

    // ✅ Only SuperAdmin can delete pets
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        logger.info("Deleting pet with ID {}", id);
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

    // 🔄 Map Pet entity to PetResponseDTO with null safety
    private PetResponseDTO mapToDTO(Pet pet) {
        if (pet == null) return null;

        var owner = pet.getOwner();
        PetResponseDTO.OwnerDTO ownerDTO = null;

        if (owner != null) {
            String username = (owner.getUser() != null) ? owner.getUser().getUsername() : null;
            ownerDTO = new PetResponseDTO.OwnerDTO(
                    owner.getId(),
                    owner.getName(),
                    owner.getEmail(),
                    owner.getPhone(),
                    owner.getAddress(),
                    username
            );
        }

        return new PetResponseDTO(
                pet.getId(),
                pet.getName(),
                pet.getBreed(),
                pet.getBirthDate(),
                ownerDTO
        );
    }
}