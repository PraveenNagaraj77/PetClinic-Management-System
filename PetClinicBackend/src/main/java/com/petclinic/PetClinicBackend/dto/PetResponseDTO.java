package com.petclinic.PetClinicBackend.dto;

import java.time.LocalDate;

public class PetResponseDTO {

    private Long id;
    private String name;
    private String breed;
    private LocalDate birthDate;
    private OwnerDTO owner;

    // --- Constructors ---
    public PetResponseDTO() {
    }

    public PetResponseDTO(Long id, String name, String breed, LocalDate birthDate, OwnerDTO owner) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.birthDate = birthDate;
        this.owner = owner;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public OwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(OwnerDTO owner) {
        this.owner = owner;
    }

    // --- Nested static DTO class for Owner ---
    public static class OwnerDTO {

        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String username;

        // --- Constructors ---
        public OwnerDTO() {
        }

        public OwnerDTO(Long id, String name, String email, String phone, String address, String username) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.username = username;
        }

        // --- Getters & Setters ---
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }
}
