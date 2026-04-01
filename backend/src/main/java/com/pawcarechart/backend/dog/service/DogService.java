package com.pawcarechart.backend.dog.service;

import com.pawcarechart.backend.dog.dto.DogCreateRequest;
import com.pawcarechart.backend.dog.dto.DogResponse;
import com.pawcarechart.backend.dog.dto.DogUpdateRequest;
import com.pawcarechart.backend.dog.entity.Dog;
import com.pawcarechart.backend.dog.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DogService {

    private final DogRepository dogRepository;

    public List<DogResponse> getMyDogs(Long userId) {
        return dogRepository.findAllByUserId(userId).stream()
                .map(DogResponse::from)
                .collect(Collectors.toList());
    }

    public DogResponse getDogDetails(Long dogId, Long userId) {
        Dog dog = dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "반려견 정보를 찾을 수 없거나 권한이 없습니다."));
        return DogResponse.from(dog);
    }

    @Transactional
    public DogResponse registerDog(DogCreateRequest request, Long userId) {
        Dog dog = Dog.builder()
                .userId(userId)
                .name(request.getName())
                .breed(request.getBreed())
                .birthDate(request.getBirthDate())
                .weight(request.getWeight())
                .profileImageUrl(request.getProfileImageUrl())
                .build();
        
        return DogResponse.from(dogRepository.save(dog));
    }

    @Transactional
    public DogResponse updateDog(Long dogId, DogUpdateRequest request, Long userId) {
        Dog dog = dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없거나 존재하지 않는 반려견입니다."));
        
        dog.update(
            request.getName(),
            request.getBreed(),
            request.getBirthDate(),
            request.getWeight(),
            request.getProfileImageUrl()
        );
        
        return DogResponse.from(dog);
    }

    @Transactional
    public void deleteDog(Long dogId, Long userId) {
        Dog dog = dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> {
                    System.out.println("Delete failed: Dog not found or unauthorized. dogId: " + dogId + ", userId: " + userId);
                    return new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없거나 존재하지 않는 반려견입니다.");
                });
        
        dogRepository.delete(dog);
        System.out.println("Delete success: dogId " + dogId + " has been removed.");
    }
}
