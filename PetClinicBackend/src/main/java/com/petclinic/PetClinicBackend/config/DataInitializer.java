package com.petclinic.PetClinicBackend.config;

import com.petclinic.PetClinicBackend.model.Role;
import com.petclinic.PetClinicBackend.model.User;
import com.petclinic.PetClinicBackend.repository.RoleRepository;
import com.petclinic.PetClinicBackend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        try {
            createRoleIfNotFound("ROLE_SUPERADMIN");
            createRoleIfNotFound("ROLE_ADMIN");
            createRoleIfNotFound("ROLE_USER");

            createUserIfNotFound(
                    "superadmin@petclinic.com",
                    "Super Admin",
                    "superadmin123",
                    "ROLE_SUPERADMIN"
            );

            createUserIfNotFound(
                    "admin@petclinic.com",
                    "Admin",
                    "admin123",
                    "ROLE_ADMIN"
            );

        } catch (Exception e) {
            System.err.println("❌ Error during DataInitializer init: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createRoleIfNotFound(String roleName) {
        roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role();
            role.setName(roleName);
            return roleRepository.save(role);
        });
    }

    private void createUserIfNotFound(String email, String name, String rawPassword, String roleName) {
        if (!userRepository.existsByEmail(email)) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException(roleName + " not found"));

            Set<Role> roles = new HashSet<>();
            roles.add(role);

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setUsername(email); // ✅ SET username!
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRoles(roles);

            userRepository.save(user);
            System.out.println("✅ Created user: " + email + " / " + rawPassword);
        }
    }
}
