package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.model.Vet;
import com.petclinic.PetClinicBackend.service.VetService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vets")
public class VetController {

    private static final Logger logger = LoggerFactory.getLogger(VetController.class);
    private final VetService vetService;

    public VetController(VetService vetService) {
        this.vetService = vetService;
    }

    // 🔐 Only Admin/SuperAdmin can add new vets
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Vet> addVet(@Valid @RequestBody Vet vet) {
        logger.info("Adding new vet: {}", vet.getName());
        return ResponseEntity.ok(vetService.addVet(vet));
    }

    // ✅ Any authenticated user can view all vets
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Vet> getAllVets() {
        logger.info("Fetching all vets");
        return vetService.getAllVets();
    }

    // ✅ Any authenticated user can fetch vet by ID
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Vet> getVetById(@PathVariable Long id) {
        logger.info("Fetching vet with ID {}", id);
        return vetService.getVetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔐 Only Admin/SuperAdmin can update vet
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Vet> updateVet(@PathVariable Long id, @Valid @RequestBody Vet vet) {
        try {
            logger.info("Updating vet with ID {}", id);
            Vet updated = vetService.updateVet(id, vet);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            logger.error("Vet with ID {} not found", id);
            return ResponseEntity.notFound().build();
        }
    }

    // 🔐 Only Admin/SuperAdmin can delete vet
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> deleteVet(@PathVariable Long id) {
        logger.warn("Deleting vet with ID {}", id);
        vetService.deleteVet(id);
        return ResponseEntity.ok("Vet deleted successfully.");
    }
}
