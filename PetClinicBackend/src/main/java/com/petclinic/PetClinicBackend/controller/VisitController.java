package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.config.SecurityUtil;
import com.petclinic.PetClinicBackend.dto.VisitRequest;
import com.petclinic.PetClinicBackend.model.Pet;
import com.petclinic.PetClinicBackend.model.Vet;
import com.petclinic.PetClinicBackend.model.Visit;
import com.petclinic.PetClinicBackend.service.UserService;
import com.petclinic.PetClinicBackend.service.VisitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;
    private final UserService userService;

    public VisitController(VisitService visitService, UserService userService) {
        this.visitService = visitService;
        this.userService = userService;
    }

    // ✅ Create a new visit
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Visit> createVisit(@RequestBody VisitRequest request) {
        try {
            Pet pet = visitService.getPetById(request.getPetId());
            Vet vet = visitService.getVetById(request.getVetId());

            Visit visit = new Visit();
            visit.setVisitDate(request.getDate());
            visit.setDescription(request.getDescription());
            visit.setPet(pet);
            visit.setVet(vet);

            Visit savedVisit = visitService.saveVisit(visit);
            return ResponseEntity.status(201).body(savedVisit);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // ✅ Get visits for the currently logged-in user
    @GetMapping("/mine")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Visit>> getMyVisits() {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        List<Visit> visits = visitService.getVisitsForCurrentUser(username);
        return ResponseEntity.ok(visits);
    }

    // ✅ Get all visits (Admin/SuperAdmin only)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<Visit>> getAllVisits() {
        List<Visit> visits = visitService.getAllVisits();
        return ResponseEntity.ok(visits);
    }

    // ✅ Get visit by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Visit> getVisitById(@PathVariable Long id) {
        return visitService.getVisitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get visits by pet ID
    @GetMapping("/pet/{petId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<Visit>> getVisitsByPetId(@PathVariable Long petId) {
        List<Visit> visits = visitService.getVisitsByPetId(petId);
        return ResponseEntity.ok(visits);
    }

    // ✅ Update a visit
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Visit> updateVisit(@PathVariable Long id, @RequestBody Visit updatedVisit) {
        Optional<Visit> existingVisitOpt = visitService.getVisitById(id);

        if (existingVisitOpt.isPresent()) {
            Visit existingVisit = existingVisitOpt.get();

            // Optional fields to update
            if (updatedVisit.getVisitDate() != null) {
                existingVisit.setVisitDate(updatedVisit.getVisitDate());
            }

            if (updatedVisit.getDescription() != null) {
                existingVisit.setDescription(updatedVisit.getDescription());
            }

            if (updatedVisit.getPet() != null) {
                existingVisit.setPet(updatedVisit.getPet());
            }

            if (updatedVisit.getVet() != null) {
                existingVisit.setVet(updatedVisit.getVet());
            }

            if (updatedVisit.getStatus() != null) {
                existingVisit.setStatus(updatedVisit.getStatus());
            }

            Visit saved = visitService.saveVisit(existingVisit);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete a visit (SuperAdmin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<String> deleteVisit(@PathVariable Long id) {
        visitService.deleteVisit(id);
        return ResponseEntity.ok("Visit deleted successfully.");
    }
}
