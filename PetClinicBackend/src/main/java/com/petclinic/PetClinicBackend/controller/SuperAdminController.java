package com.petclinic.PetClinicBackend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public String getSuperAdminDashboard() {
        return "Welcome to SuperAdmin Dashboard!";
    }
}
