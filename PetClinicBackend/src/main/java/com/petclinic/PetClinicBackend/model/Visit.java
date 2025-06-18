package com.petclinic.PetClinicBackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd") // ✅ Format date in JSON responses
    @Column(nullable = false)
    private LocalDate visitDate;

    @Column(nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "visits", "owner"}) // ✅ Avoid recursion
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "visits"}) // ✅ Avoid recursion
    private Vet vet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitStatus status = VisitStatus.UPCOMING;

    // --- Constructors ---
    public Visit() {}

    public Visit(Long id, LocalDate visitDate, String description, Pet pet, Vet vet, VisitStatus status) {
        this.id = id;
        this.visitDate = visitDate;
        this.description = description;
        this.pet = pet;
        this.vet = vet;
        this.status = status;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public Vet getVet() {
        return vet;
    }

    public void setVet(Vet vet) {
        this.vet = vet;
    }

    public VisitStatus getStatus() {
        return status;
    }

    public void setStatus(VisitStatus status) {
        this.status = status;
    }

    // --- toString (for debugging/logging) ---
    @Override
    public String toString() {
        return "Visit{" +
                "id=" + id +
                ", visitDate=" + visitDate +
                ", description='" + description + '\'' +
                ", petId=" + (pet != null ? pet.getId() : "null") +
                ", vetId=" + (vet != null ? vet.getId() : "null") +
                ", status=" + status +
                '}';
    }
}
