package com.skillbridge.service;

import com.skillbridge.dto.ReviewRequest;
import com.skillbridge.dto.ReviewResponse;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.exception.UnauthorizedException;
import com.skillbridge.model.*;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReviewResponse createReview(ReviewRequest request, String email) {
        User reviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getClient().getEmail().equals(email)) {
            throw new UnauthorizedException("You can only review your own bookings");
        }

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("You can only review completed bookings");
        }

        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new BadRequestException("You have already reviewed this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return ReviewResponse.from(reviewRepository.save(review));
    }

    public Page<ReviewResponse> getReviewsByService(Long serviceId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.findByServiceId(serviceId, pageable).map(ReviewResponse::from);
    }
}
