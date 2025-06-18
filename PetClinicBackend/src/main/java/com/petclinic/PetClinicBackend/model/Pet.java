package com.petclinic.PetClinicBackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String breed;

    private LocalDate birthDate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties({"pets"})  // Prevents infinite recursion during serialization
    private Owner owner;

    // No-arg constructor
    public Pet() {}

    // All-args constructor
    public Pet(Long id, String name, String breed, LocalDate birthDate, Owner owner) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.birthDate = birthDate;
        this.owner = owner;
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

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    // Builder pattern
    public static class Builder {
        private Long id;
        private String name;
        private String breed;
        private LocalDate birthDate;
        private Owner owner;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder breed(String breed) {
            this.breed = breed;
            return this;
        }

        public Builder birthDate(LocalDate birthDate) {
            this.birthDate = birthDate;
            return this;
        }

        public Builder owner(Owner owner) {
            this.owner = owner;
            return this;
        }

        public Pet build() {
            return new Pet(id, name, breed, birthDate, owner);
        }
    }
}
