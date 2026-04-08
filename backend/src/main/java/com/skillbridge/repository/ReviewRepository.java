package com.skillbridge.repository;

import com.skillbridge.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.booking.service.id = :serviceId")
    Page<Review> findByServiceId(@Param("serviceId") Long serviceId, Pageable pageable);

    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.booking.service.id = :serviceId")
    Double findAverageRatingByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.booking.service.id = :serviceId")
    Long countByServiceId(@Param("serviceId") Long serviceId);
}
