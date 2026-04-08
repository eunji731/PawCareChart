package com.pawcarechart.backend.code.dto;

import com.pawcarechart.backend.code.entity.CommonCode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "공통 코드 응답")
public class CodeResponse {
    @Schema(description = "코드 식별자(PK)")
    private Long id;

    @Schema(description = "코드값")
    private String code;

    @Schema(description = "코드명")
    private String codeName;

    @Schema(description = "정렬 순서")
    private Integer sortOrder;

    public static CodeResponse from(CommonCode entity) {
        return CodeResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .codeName(entity.getCodeName())
                .sortOrder(entity.getSortOrder())
                .build();
    }
}
