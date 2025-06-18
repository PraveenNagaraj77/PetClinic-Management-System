package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.dto.LoginRequest;
import com.petclinic.PetClinicBackend.dto.LoginResponse;
import com.petclinic.PetClinicBackend.dto.RegisterRequest;
import com.petclinic.PetClinicBackend.model.Owner;
import com.petclinic.PetClinicBackend.model.Role;
import com.petclinic.PetClinicBackend.model.User;
import com.petclinic.PetClinicBackend.repository.OwnerRepository;
import com.petclinic.PetClinicBackend.repository.RoleRepository;
import com.petclinic.PetClinicBackend.repository.UserRepository;
import com.petclinic.PetClinicBackend.security.JwtUtil;
import com.petclinic.PetClinicBackend.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService; // ✅ Inject here

    @Autowired
    private OwnerRepository ownerRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest userRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldError().getDefaultMessage();
            return ResponseEntity.badRequest().body("⚠ " + errorMessage);
        }

        if (userRepository.existsByEmail(userRequest.getEmail())) {
            return ResponseEntity.badRequest().body("⚠ Email is already registered");
        }

        User user = new User();
        user.setUsername(userRequest.getUsername());
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
        user.setRoles(Collections.singleton(userRole));

        User savedUser = userRepository.save(user);

        Owner owner = new Owner();
        owner.setName(userRequest.getName());
        owner.setEmail(userRequest.getEmail());
        owner.setPhone(userRequest.getPhone());
        owner.setAddress(userRequest.getAddress());
        owner.setUser(savedUser);

        ownerRepository.save(owner);

        return ResponseEntity.ok("✅ Registered successfully.");
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        // ✅ Load user details for token generation
        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new LoginResponse(token));
    }
}
