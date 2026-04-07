package com.pawcarechart.backend.dog.service;

import com.pawcarechart.backend.code.entity.CommonCode;
import com.pawcarechart.backend.code.repository.CommonCodeRepository;
import com.pawcarechart.backend.dog.dto.DogCreateRequest;
import com.pawcarechart.backend.dog.dto.DogResponse;
import com.pawcarechart.backend.dog.dto.DogUpdateRequest;
import com.pawcarechart.backend.dog.entity.Dog;
import com.pawcarechart.backend.dog.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DogService {

    private final DogRepository dogRepository;
    private final CommonCodeRepository commonCodeRepository;
    private final com.pawcarechart.backend.file.service.FileService fileService;

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
        log.info("[DogService] registerDog START. name={}, profileImageId={}, userId={}", request.getName(), request.getProfileImageFileId(), userId);
        Dog dog = Dog.builder()
                .userId(userId)
                .name(request.getName())
                .breed(request.getBreed())
                .birthDate(request.getBirthDate())
                .weight(request.getWeight())
                .build();
        
        Dog savedDog = dogRepository.save(dog);

        if (request.getProfileImageFileId() != null) {
            log.info("[DogService] Profile image mapping detected. ID: {}", request.getProfileImageFileId());
            Long dogTargetId = getCodeId("FILE_TARGET_TYPE", "DOG");
            fileService.connectFilesToTarget(List.of(request.getProfileImageFileId()), dogTargetId, savedDog.getId(), userId);
            
            // 프로필 URL 업데이트 (조회 편의를 위해 URL을 강아지 엔티티에 업데이트)
            com.pawcarechart.backend.file.dto.FileResponse file = fileService.getFiles(dogTargetId, savedDog.getId()).stream().findFirst().orElse(null);
            if (file != null) {
                log.info("[DogService] Found mapped file URL: {}", file.getFileUrl());
                savedDog.update(savedDog.getName(), savedDog.getBreed(), savedDog.getBirthDate(), savedDog.getWeight(), file.getFileUrl());
            }
        }
        
        return DogResponse.from(savedDog);
    }

    @Transactional
    public DogResponse updateDog(Long dogId, DogUpdateRequest request, Long userId) {
        Dog dog = dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없거나 존재하지 않는 반려견입니다."));
        
        if (request.getProfileImageFileId() != null) {
            Long dogTargetId = getCodeId("FILE_TARGET_TYPE", "DOG");
            fileService.syncFilesToTarget(List.of(request.getProfileImageFileId()), dogTargetId, dogId, userId);
            
            com.pawcarechart.backend.file.dto.FileResponse file = fileService.getFiles(dogTargetId, dogId).stream().findFirst().orElse(null);
            if (file != null) {
                dog.update(request.getName(), request.getBreed(), request.getBirthDate(), request.getWeight(), file.getFileUrl());
            } else {
                dog.update(request.getName(), request.getBreed(), request.getBirthDate(), request.getWeight(), null);
            }
        } else {
            dog.update(request.getName(), request.getBreed(), request.getBirthDate(), request.getWeight(), null);
        }
        
        return DogResponse.from(dog);
    }

    @Transactional
    public void deleteDog(Long dogId, Long userId) {
        Dog dog = dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> {
                    System.out.println("Delete failed: Dog not found or unauthorized. dogId: " + dogId + ", userId: " + userId);
                    return new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없거나 존재하지 않는 반려견입니다.");
                });
        
        // 연결된 파일 삭제
        Long dogTargetId = getCodeId("FILE_TARGET_TYPE", "DOG");
        fileService.deleteFilesByTarget(dogTargetId, dogId);

        dogRepository.delete(dog);
        System.out.println("Delete success: dogId " + dogId + " has been removed.");
    }

    private Long getCodeId(String groupCode, String code) {
        return commonCodeRepository.findAllByGroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y")
                .stream()
                .filter(c -> c.getCode().equals(code))
                .findFirst()
                .map(CommonCode::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "필요한 공통 코드가 정의되지 않았습니다: " + code));
    }
}
