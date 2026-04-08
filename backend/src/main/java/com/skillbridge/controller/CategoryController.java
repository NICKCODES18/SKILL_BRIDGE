package com.skillbridge.controller;

import com.skillbridge.dto.ApiResponse;
import com.skillbridge.model.Category;
import com.skillbridge.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findAll()));
    }
}
