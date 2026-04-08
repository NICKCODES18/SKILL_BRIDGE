package com.skillbridge.dto;

import com.skillbridge.model.Service;
import com.skillbridge.model.ServiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer deliveryDays;
    private Long categoryId;
    private String categoryName;
    private Long providerId;
    private String providerName;
    private String providerBio;
    private ServiceStatus status;
    private Double averageRating;
    private Long reviewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ServiceResponse from(Service s) {
        return ServiceResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .description(s.getDescription())
                .price(s.getPrice())
                .deliveryDays(s.getDeliveryDays())
                .categoryId(s.getCategory().getId())
                .categoryName(s.getCategory().getName())
                .providerId(s.getProvider().getId())
                .providerName(s.getProvider().getName())
                .providerBio(s.getProvider().getBio())
                .status(s.getStatus())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
