package com.skillbridge.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    private String message;
}
