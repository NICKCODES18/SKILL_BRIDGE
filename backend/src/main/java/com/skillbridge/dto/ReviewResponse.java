package com.skillbridge.dto;

import com.skillbridge.model.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long bookingId;
    private Long serviceId;
    private Long reviewerId;
    private String reviewerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewResponse from(Review r) {
        return ReviewResponse.builder()
                .id(r.getId())
                .bookingId(r.getBooking().getId())
                .serviceId(r.getBooking().getService().getId())
                .reviewerId(r.getReviewer().getId())
                .reviewerName(r.getReviewer().getName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
