package com.petclinic.PetClinicBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Password is required")
    private String password;

    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;


    public @NotBlank(message = "Username is required") String getUsername() {
        return username;
    }

    public void setUsername(@NotBlank(message = "Username is required") String username) {
        this.username = username;
    }

    public @NotBlank(message = "Name is required") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Name is required") String name) {
        this.name = name;
    }

    public @NotBlank(message = "Password is required") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") String password) {
        this.password = password;
    }

    public @Email(message = "Email must be valid") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Email must be valid") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Phone is required") String getPhone() {
        return phone;
    }

    public void setPhone(@NotBlank(message = "Phone is required") String phone) {
        this.phone = phone;
    }

    public @NotBlank(message = "Address is required") String getAddress() {
        return address;
    }

    public void setAddress(@NotBlank(message = "Address is required") String address) {
        this.address = address;
    }
}
