package com.petclinic.PetClinicBackend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERADMIN')")
    public String getAdminDashboard() {
        return "Welcome to Admin Dashboard!";
    }
}
