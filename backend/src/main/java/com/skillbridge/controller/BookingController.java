package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.model.BookingStatus;
import com.skillbridge.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.createBooking(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Booking created", response));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername(), page, size));
    }

    @GetMapping("/received")
    public ResponseEntity<Page<BookingResponse>> getReceivedBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(bookingService.getReceivedBookings(userDetails.getUsername(), page, size));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        BookingResponse response = bookingService.updateBookingStatus(id, request.getStatus(), userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
    }
}
