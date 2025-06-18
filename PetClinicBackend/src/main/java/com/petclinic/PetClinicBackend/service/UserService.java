package com.petclinic.PetClinicBackend.service;

import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Owner;
import com.petclinic.PetClinicBackend.model.User;
import com.petclinic.PetClinicBackend.repository.OwnerRepository;
import com.petclinic.PetClinicBackend.repository.UserRepository;
import com.petclinic.PetClinicBackend.config.SecurityUtil;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final OwnerRepository ownerRepository;

    public UserService(UserRepository userRepository, OwnerRepository ownerRepository) {
        this.userRepository = userRepository;
        this.ownerRepository = ownerRepository;
    }

    public User getCurrentUser() {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", "unknown"));

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    public boolean isCurrentUserOwnerOf(Long ownerId, String username) {
        Owner owner = ownerRepository.findByUser_Email(username)
                .orElseThrow(() -> new ResourceNotFoundException("Owner", "username", username));

        return owner.getId().equals(ownerId);
    }

    public boolean isAdmin(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase("ROLE_ADMIN") ||
                        role.getName().equalsIgnoreCase("ROLE_SUPERADMIN"));
    }
}
