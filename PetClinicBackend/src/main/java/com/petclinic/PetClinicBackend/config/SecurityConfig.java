package com.petclinic.PetClinicBackend.config;

import com.petclinic.PetClinicBackend.security.JwtAuthenticationFilter;
import com.petclinic.PetClinicBackend.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter, CustomUserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    // ✅ Password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ DaoAuthenticationProvider using your CustomUserDetailsService
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // ✅ Final fix: Use ProviderManager with our DaoAuthenticationProvider
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(daoAuthenticationProvider());
    }

    // ✅ Security filter chain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()

                        // Vets
                        .requestMatchers(HttpMethod.GET, "/api/vets/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/vets/**").hasAnyRole("ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/vets/**").hasAnyRole("ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/vets/**").hasAnyRole("ADMIN", "SUPERADMIN")

                        // Pets
                        .requestMatchers(HttpMethod.GET, "/api/pets/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/pets").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/pets/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/pets/**").hasAnyRole("ADMIN", "SUPERADMIN")

                        // Role-based APIs
                        .requestMatchers("/api/superadmin/**").hasRole("SUPERADMIN")
                        .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPERADMIN")
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN", "SUPERADMIN")

                        // Any other endpoint
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
