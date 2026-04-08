package com.skillbridge.service;

import com.skillbridge.dto.AdminStatsResponse;
import com.skillbridge.dto.ServiceResponse;
import com.skillbridge.dto.UserResponse;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.model.BookingStatus;
import com.skillbridge.model.ServiceStatus;
import com.skillbridge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public AdminStatsResponse getStats() {
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalServices(serviceRepository.count())
                .activeServices(serviceRepository.countByStatus(ServiceStatus.ACTIVE))
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .completedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED))
                .totalReviews(reviewRepository.count())
                .build();
    }

    public Page<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return userRepository.findAll(pageable).map(UserResponse::from);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    public Page<ServiceResponse> getAllServicesAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return serviceRepository.findAll(pageable).map(ServiceResponse::from);
    }

    public ServiceResponse toggleServiceStatus(Long id) {
        com.skillbridge.model.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        service.setStatus(service.getStatus() == ServiceStatus.ACTIVE ? ServiceStatus.INACTIVE : ServiceStatus.ACTIVE);
        return ServiceResponse.from(serviceRepository.save(service));
    }
}
