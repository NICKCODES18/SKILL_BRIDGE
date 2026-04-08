package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted", null));
    }

    @GetMapping("/services")
    public ResponseEntity<Page<ServiceResponse>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminService.getAllServicesAdmin(page, size));
    }

    @PatchMapping("/services/{id}/toggle")
    public ResponseEntity<ApiResponse<ServiceResponse>> toggleService(@PathVariable Long id) {
        ServiceResponse response = adminService.toggleServiceStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Service status toggled", response));
    }
}
