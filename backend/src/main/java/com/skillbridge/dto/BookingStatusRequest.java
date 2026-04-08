package com.skillbridge.dto;

import com.skillbridge.model.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;
}
