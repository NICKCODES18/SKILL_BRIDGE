package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.service.ServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<Page<ServiceResponse>> getAllServices(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        return ResponseEntity.ok(
                serviceService.getAllServices(search, categoryId, minPrice, maxPrice, page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(serviceService.getServiceById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ServiceResponse>> getMyServices(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        return ResponseEntity.ok(serviceService.getMyServices(userDetails.getUsername(), page, size));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ServiceResponse response = serviceService.createService(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ServiceResponse response = serviceService.updateService(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        serviceService.deleteService(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Service deleted", null));
    }
}
