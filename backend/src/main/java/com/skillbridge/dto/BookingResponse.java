package com.skillbridge.dto;

import com.skillbridge.model.Booking;
import com.skillbridge.model.BookingStatus;
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
public class BookingResponse {
    private Long id;
    private Long serviceId;
    private String serviceTitle;
    private BigDecimal servicePrice;
    private Long clientId;
    private String clientName;
    private String clientEmail;
    private Long providerId;
    private String providerName;
    private BookingStatus status;
    private String message;
    private boolean hasReview;
    private LocalDateTime bookedAt;
    private LocalDateTime updatedAt;

    public static BookingResponse from(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .serviceId(b.getService().getId())
                .serviceTitle(b.getService().getTitle())
                .servicePrice(b.getService().getPrice())
                .clientId(b.getClient().getId())
                .clientName(b.getClient().getName())
                .clientEmail(b.getClient().getEmail())
                .providerId(b.getService().getProvider().getId())
                .providerName(b.getService().getProvider().getName())
                .status(b.getStatus())
                .message(b.getMessage())
                .bookedAt(b.getBookedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}
