package com.skillbridge.service;

import com.skillbridge.dto.ServiceRequest;
import com.skillbridge.dto.ServiceResponse;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.exception.UnauthorizedException;
import com.skillbridge.model.Category;
import com.skillbridge.model.Service;
import com.skillbridge.model.ServiceStatus;
import com.skillbridge.model.User;
import com.skillbridge.repository.CategoryRepository;
import com.skillbridge.repository.ReviewRepository;
import com.skillbridge.repository.ServiceRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import java.math.BigDecimal;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public Page<ServiceResponse> getAllServices(String search, Long categoryId,
                                                BigDecimal minPrice, BigDecimal maxPrice,
                                                int page, int size, String sortBy) {
        Sort sort = sortBy.equals("price")
                ? Sort.by(Sort.Direction.ASC, "price")
                : Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<Service> services = serviceRepository.findWithFilters(
                ServiceStatus.ACTIVE, searchParam, categoryId, minPrice, maxPrice, pageable);

        return services.map(s -> {
            ServiceResponse r = ServiceResponse.from(s);
            Double avg = reviewRepository.findAverageRatingByServiceId(s.getId());
            Long count = reviewRepository.countByServiceId(s.getId());
            r.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null);
            r.setReviewCount(count);
            return r;
        });
    }

    public ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        ServiceResponse r = ServiceResponse.from(service);
        Double avg = reviewRepository.findAverageRatingByServiceId(id);
        Long count = reviewRepository.countByServiceId(id);
        r.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null);
        r.setReviewCount(count);
        return r;
    }

    public Page<ServiceResponse> getMyServices(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return serviceRepository.findByProvider(user, pageable).map(ServiceResponse::from);
    }

    public ServiceResponse createService(ServiceRequest request, String email) {
        User provider = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Service service = Service.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .deliveryDays(request.getDeliveryDays())
                .category(category)
                .provider(provider)
                .status(ServiceStatus.ACTIVE)
                .build();

        return ServiceResponse.from(serviceRepository.save(service));
    }

    public ServiceResponse updateService(Long id, ServiceRequest request, String email) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!service.getProvider().getEmail().equals(email)) {
            throw new UnauthorizedException("You can only update your own services");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDeliveryDays(request.getDeliveryDays());
        service.setCategory(category);

        return ServiceResponse.from(serviceRepository.save(service));
    }

    public void deleteService(Long id, String email) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!service.getProvider().getEmail().equals(email)) {
            throw new UnauthorizedException("You can only delete your own services");
        }
        serviceRepository.delete(service);
    }
}
