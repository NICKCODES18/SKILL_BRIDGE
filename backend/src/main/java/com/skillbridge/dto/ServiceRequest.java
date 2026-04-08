package com.skillbridge.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be 5–200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 20, message = "Description must be at least 20 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Delivery days is required")
    @Min(value = 1, message = "Delivery days must be at least 1")
    private Integer deliveryDays;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}
