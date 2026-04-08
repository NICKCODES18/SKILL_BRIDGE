package com.skillbridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long totalServices;
    private long activeServices;
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalReviews;
}
