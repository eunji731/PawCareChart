package com.pawcarechart.backend.dog.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.dog.dto.DogCreateRequest;
import com.pawcarechart.backend.dog.dto.DogResponse;
import com.pawcarechart.backend.dog.dto.DogUpdateRequest;
import com.pawcarechart.backend.dog.service.DogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dogs")
@RequiredArgsConstructor
@Tag(name = "반려견 관리", description = "반려견 등록, 조회, 수정, 삭제 API")
public class DogController {

    private final DogService dogService;

    @GetMapping
    @Operation(summary = "반려견 목록 조회", description = "로그인한 사용자의 반려견 목록을 조회합니다.")
    public ApiResult<List<DogResponse>> getMyDogs(@AuthenticationPrincipal String userId) {
        return ApiResult.ok(dogService.getMyDogs(Long.valueOf(userId)));
    }

    @GetMapping("/{dogId}")
    @Operation(summary = "반려견 단건 조회", description = "특정 반려견의 상세 정보를 조회합니다.")
    public ApiResult<DogResponse> getDogDetails(@PathVariable Long dogId, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(dogService.getDogDetails(dogId, Long.valueOf(userId)));
    }

    @PostMapping
    @Operation(summary = "반려견 등록", description = "새로운 반려견을 등록합니다.")
    public ApiResult<DogResponse> registerDog(@Valid @RequestBody DogCreateRequest request, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(dogService.registerDog(request, Long.valueOf(userId)));
    }

    @PutMapping("/{dogId}")
    @Operation(summary = "반려견 수정", description = "반려견 정보를 수정합니다.")
    public ApiResult<DogResponse> updateDog(@PathVariable Long dogId, @Valid @RequestBody DogUpdateRequest request, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(dogService.updateDog(dogId, request, Long.valueOf(userId)));
    }

    @DeleteMapping("/{dogId}")
    @Operation(summary = "반려견 삭제", description = "반려견 정보를 삭제합니다.")
    public ApiResult<Void> deleteDog(@PathVariable Long dogId, @AuthenticationPrincipal String userId) {
        dogService.deleteDog(dogId, Long.valueOf(userId));
        return ApiResult.message("반려견 정보가 삭제되었습니다.");
    }
}
