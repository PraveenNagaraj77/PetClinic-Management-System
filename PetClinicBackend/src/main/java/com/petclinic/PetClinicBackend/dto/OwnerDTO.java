package com.petclinic.PetClinicBackend.dto;

import com.petclinic.PetClinicBackend.model.Owner;

public class OwnerDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String username;  // from linked User

    public OwnerDTO() {
        // default constructor
    }

    // Constructor to map Owner entity to OwnerDTO
    public OwnerDTO(Owner owner) {
        this.id = owner.getId();
        this.name = owner.getName();
        this.email = owner.getEmail();
        this.phone = owner.getPhone();
        this.address = owner.getAddress();
        this.username = owner.getUser() != null ? owner.getUser().getUsername() : null;
    }

    // Getters and Setters

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
