package com.pawcarechart.backend.dog.repository;

import com.pawcarechart.backend.dog.entity.Dog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DogRepository extends JpaRepository<Dog, Long> {
    List<Dog> findAllByUserId(Long userId);
    Optional<Dog> findByIdAndUserId(Long id, Long userId);
}
