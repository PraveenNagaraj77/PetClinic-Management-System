package com.petclinic.PetClinicBackend.controller;

import com.petclinic.PetClinicBackend.config.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    // ✅ USER / ADMIN / SUPERADMIN can access their dashboard
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('USER','ADMIN','SUPERADMIN')")
    public ResponseEntity<Map<String, String>> getUserDashboard() {
        String username = SecurityUtil.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("User not logged in"));

        logger.info("Dashboard accessed by user: {}", username);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to User Dashboard!");
        response.put("username", username);
        return ResponseEntity.ok(response);
    }
}
