package com.skillbridge.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "booked_at", updatable = false)
    private LocalDateTime bookedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.bookedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = BookingStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
