package com.petclinic.PetClinicBackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.time.LocalDate;


public class VisitRequest {

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotBlank
    private String description;

    @NotNull
    private Long petId;

    @NotNull
    private Long vetId;

    public @NotNull LocalDate getDate() {
        return date;
    }

    public void setDate(@NotNull LocalDate date) {
        this.date = date;
    }

    public @NotBlank String getDescription() {
        return description;
    }

    public void setDescription(@NotBlank String description) {
        this.description = description;
    }

    public @NotNull Long getPetId() {
        return petId;
    }

    public void setPetId(@NotNull Long petId) {
        this.petId = petId;
    }

    public @NotNull Long getVetId() {
        return vetId;
    }

    public void setVetId(@NotNull Long vetId) {
        this.vetId = vetId;
    }
}