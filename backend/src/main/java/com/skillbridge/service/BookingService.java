package com.skillbridge.service;

import com.skillbridge.dto.BookingRequest;
import com.skillbridge.dto.BookingResponse;
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
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public BookingResponse createBooking(BookingRequest request, String email) {
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        com.skillbridge.model.Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (service.getProvider().getEmail().equals(email)) {
            throw new BadRequestException("You cannot book your own service");
        }

        if (service.getStatus() != ServiceStatus.ACTIVE) {
            throw new BadRequestException("Service is not available");
        }

        Booking booking = Booking.builder()
                .service(service)
                .client(client)
                .message(request.getMessage())
                .status(BookingStatus.PENDING)
                .build();

        return BookingResponse.from(bookingRepository.save(booking));
    }

    public Page<BookingResponse> getMyBookings(String email, int page, int size) {
        User client = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookedAt"));
        return bookingRepository.findByClient(client, pageable).map(b -> {
            BookingResponse r = BookingResponse.from(b);
            r.setHasReview(reviewRepository.existsByBookingId(b.getId()));
            return r;
        });
    }

    public Page<BookingResponse> getReceivedBookings(String email, int page, int size) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookedAt"));
        return bookingRepository.findByServiceProvider(provider, pageable).map(BookingResponse::from);
    }

    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus, String email) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        boolean isClient = booking.getClient().getEmail().equals(email);
        boolean isProvider = booking.getService().getProvider().getEmail().equals(email);

        if (!isClient && !isProvider) {
            throw new UnauthorizedException("Not allowed to modify this booking");
        }

        // Business rules
        if (newStatus == BookingStatus.CANCELLED && !isClient) {
            throw new UnauthorizedException("Only clients can cancel bookings");
        }
        if ((newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.COMPLETED) && !isProvider) {
            throw new UnauthorizedException("Only providers can confirm or complete bookings");
        }

        booking.setStatus(newStatus);
        return BookingResponse.from(bookingRepository.save(booking));
    }
}
