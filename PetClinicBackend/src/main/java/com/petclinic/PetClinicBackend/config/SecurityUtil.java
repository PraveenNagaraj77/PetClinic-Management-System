package com.petclinic.PetClinicBackend.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Optional;

public class SecurityUtil {

    private static final String ROLE_PREFIX = "ROLE_";

    // Get the currently authenticated username
    public static Optional<String> getCurrentUserLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.ofNullable(authentication.getName());
        }
        return Optional.empty();
    }

    // Check if the current user has a specific role
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(ROLE_PREFIX + role));
    }
}
