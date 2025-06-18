package com.petclinic.PetClinicBackend.service;

import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Owner;
import com.petclinic.PetClinicBackend.model.User;
import com.petclinic.PetClinicBackend.repository.OwnerRepository;
import com.petclinic.PetClinicBackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all owners
    public List<Owner> getAllOwners() {
        return ownerRepository.findAll();
    }

    // ✅ Get owner by ID
    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    // ✅ Create new owner
    public Owner createOwner(Owner owner) {
        if (owner.getUser() != null && owner.getUser().getId() != null) {
            Long userId = owner.getUser().getId();

            Optional<Owner> existingOwnerOpt = ownerRepository.findByUser_Id(userId);
            if (existingOwnerOpt.isPresent()) {
                throw new RuntimeException("Owner already exists for user ID: " + userId);
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            owner.setUser(user);
        }

        return ownerRepository.save(owner);
    }

    // ✅ Update owner
    public Owner updateOwner(Long id, Owner ownerDetails) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", id));

        owner.setName(ownerDetails.getName());
        owner.setEmail(ownerDetails.getEmail());
        owner.setPhone(ownerDetails.getPhone());
        owner.setAddress(ownerDetails.getAddress());

        if (ownerDetails.getUser() != null && ownerDetails.getUser().getId() != null) {
            User user = userRepository.findById(ownerDetails.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerDetails.getUser().getId()));
            owner.setUser(user);
        }

        return ownerRepository.save(owner);
    }

    // ✅ Clean deletion: Owner → Pets → UserRoles → User
    @Transactional
    public void deleteOwner(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "id", id));

        User user = owner.getUser();

        // 1. Delete Owner (cascade deletes Pets)
        ownerRepository.delete(owner);

        // 2. Delete User Roles and User
        if (user != null) {
            userRepository.deleteRolesByUserId(user.getId());
            userRepository.delete(user);
        }
    }

    // ✅ Same as above – clear naming
    @Transactional
    public void deleteOwnerAndUser(Long ownerId) {
        deleteOwner(ownerId);
    }

    // ✅ Get owner by email
    public Owner getOwnerByUsername(String usernameOrEmail) {
        String email = usernameOrEmail.trim();

        return ownerRepository.findByUser_Email(email)
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
                    return ownerRepository.findByUser_Id(user.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Owner", "user_id", user.getId()));
                });
    }

    public Owner getOwnerByEmail(String email) {
        return ownerRepository.findByEmail(email.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "email", email));
    }

    public boolean doesOwnerExistForUsername(String usernameOrEmail) {
        return ownerRepository.existsByUser_Email(usernameOrEmail.trim());
    }

    public Owner autoCreateOwnerIfMissing(String name, String email, String phone, String address, User user) {
        String userEmail = user.getEmail().trim();
        if (ownerRepository.existsByUser_Email(userEmail)) {
            return ownerRepository.findByUser_Email(userEmail).get();
        }

        Owner owner = new Owner();
        owner.setName(name);
        owner.setEmail(email);
        owner.setPhone(phone);
        owner.setAddress(address);
        owner.setUser(user);
        return ownerRepository.save(owner);
    }
}
