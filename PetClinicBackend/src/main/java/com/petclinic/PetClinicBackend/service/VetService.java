package com.petclinic.PetClinicBackend.service;

import com.petclinic.PetClinicBackend.exception.ResourceNotFoundException;
import com.petclinic.PetClinicBackend.model.Vet;
import com.petclinic.PetClinicBackend.repository.VetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VetService {

    private static final Logger logger = LoggerFactory.getLogger(VetService.class);
    private final VetRepository vetRepository;

    public VetService(VetRepository vetRepository) {
        this.vetRepository = vetRepository;
    }

    public Vet addVet(Vet vet) {
        Vet savedVet = vetRepository.save(vet);
        logger.info("✅ Vet saved: {}", savedVet);
        return savedVet;
    }

    public List<Vet> getAllVets() {
        List<Vet> vets = vetRepository.findAll();
        logger.info("📋 Total vets fetched: {}", vets.size());
        return vets;
    }

    public Optional<Vet> getVetById(Long id) {
        Optional<Vet> vet = vetRepository.findById(id);
        if (vet.isPresent()) {
            logger.info("🔍 Vet found by ID {}: {}", id, vet.get());
        } else {
            logger.warn("⚠️ Vet not found with ID {}", id);
        }
        return vet;
    }

    public Vet updateVet(Long id, Vet updatedVet) {
        return vetRepository.findById(id).map(existingVet -> {
            existingVet.setName(updatedVet.getName());
            existingVet.setEmail(updatedVet.getEmail());
            existingVet.setPhone(updatedVet.getPhone());
            existingVet.setSpecialization(updatedVet.getSpecialization());
            Vet saved = vetRepository.save(existingVet);
            logger.info("✅ Vet updated with ID {}: {}", id, saved);
            return saved;
        }).orElseThrow(() -> {
            logger.error("❌ Vet not found with ID {}", id);
            return new ResourceNotFoundException("Vet", "id", id);
        });
    }

    public void deleteVet(Long id) {
        if (!vetRepository.existsById(id)) {
            logger.error("❌ Cannot delete. Vet not found with ID {}", id);
            throw new ResourceNotFoundException("Vet", "id", id);
        }
        vetRepository.deleteById(id);
        logger.warn("🗑️ Vet deleted with ID {}", id);
    }
}
