package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.config.SecurityUtil;
import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Owner;
import com.petclinic.PetClinicBackend.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    // ✅ Authenticated USER can view their own owner record
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Owner> getMyOwnerDetails() {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new UsernameNotFoundException("User not logged in"));

        Owner owner = ownerService.getOwnerByUsername(email);
        if (owner == null) {
            throw new ResourceNotFoundException("Owner profile not found for this user.");
        }

        return ResponseEntity.ok(owner);
    }

    // ✅ Authenticated USER can update their own profile
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Owner> updateMyOwnerDetails(@RequestBody Owner ownerDetails) {
        String email = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new UsernameNotFoundException("User not logged in"));

        Owner existingOwner = ownerService.getOwnerByUsername(email);
        if (existingOwner == null) {
            throw new ResourceNotFoundException("Cannot update. Owner profile not found.");
        }

        // Only allow updating safe fields
        existingOwner.setName(ownerDetails.getName());
        existingOwner.setPhone(ownerDetails.getPhone());
        existingOwner.setAddress(ownerDetails.getAddress());

        Owner updatedOwner = ownerService.updateOwner(existingOwner.getId(), existingOwner);
        return ResponseEntity.ok(updatedOwner);
    }

    // ✅ ADMIN and SUPERADMIN can get all owners
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    // ✅ ADMIN and SUPERADMIN can get owner by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        return ownerService.getOwnerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ ADMIN and SUPERADMIN can create a new owner
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public Owner createOwner(@RequestBody Owner owner) {
        return ownerService.createOwner(owner);
    }

    // ✅ ADMIN and SUPERADMIN can update any owner
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public Owner updateOwner(@PathVariable Long id, @RequestBody Owner owner) {
        return ownerService.updateOwner(id, owner);
    }

    // ✅ SUPERADMIN can delete only owner
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public void deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
    }

    // ✅ SUPERADMIN can delete owner AND user (recommended full delete)
    @DeleteMapping("/with-user/{id}")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public ResponseEntity<String> deleteOwnerWithUser(@PathVariable Long id) {
        ownerService.deleteOwnerAndUser(id);
        return ResponseEntity.ok("Owner and associated user deleted successfully.");
    }

    // ✅ ADMIN or SUPERADMIN can get Owner by user email (safe serialization)
    @GetMapping("/user/{email}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Owner> getOwnerByUserEmail(@PathVariable String email) {
        Owner owner = ownerService.getOwnerByUsername(email);
        if (owner == null) {
            throw new ResourceNotFoundException("No owner associated with this email.");
        }

        if (owner.getUser() != null) {
            owner.getUser().getId(); // force lazy load
        }

        return ResponseEntity.ok(owner);
    }
}
