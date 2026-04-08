package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ReviewResponse response = reviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review submitted", response));
    }

    @GetMapping("/service/{serviceId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByService(
            @PathVariable Long serviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByService(serviceId, page, size));
    }
}
