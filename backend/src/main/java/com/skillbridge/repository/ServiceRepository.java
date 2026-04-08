package com.skillbridge.repository;

import com.skillbridge.model.Service;
import com.skillbridge.model.ServiceStatus;
import com.skillbridge.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    Page<Service> findByProvider(User provider, Pageable pageable);

    @Query("SELECT s FROM Service s WHERE s.status = :status " +
           "AND (:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%',:search,'%')) " +
           "     OR LOWER(s.description) LIKE LOWER(CONCAT('%',:search,'%'))) " +
           "AND (:categoryId IS NULL OR s.category.id = :categoryId) " +
           "AND (:minPrice IS NULL OR s.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR s.price <= :maxPrice)")
    Page<Service> findWithFilters(
            @Param("status") ServiceStatus status,
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    long countByStatus(ServiceStatus status);
}
