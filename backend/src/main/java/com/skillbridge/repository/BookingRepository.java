package com.skillbridge.repository;

import com.skillbridge.model.Booking;
import com.skillbridge.model.BookingStatus;
import com.skillbridge.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByClient(User client, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.service.provider = :provider")
    Page<Booking> findByServiceProvider(@Param("provider") User provider, Pageable pageable);

    boolean existsByServiceIdAndClientId(Long serviceId, Long clientId);

    long countByStatus(BookingStatus status);
}
