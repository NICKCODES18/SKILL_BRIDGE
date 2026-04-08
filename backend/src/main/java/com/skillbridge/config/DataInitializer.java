package com.skillbridge.config;

import com.skillbridge.model.Category;
import com.skillbridge.model.Role;
import com.skillbridge.model.User;
import com.skillbridge.repository.CategoryRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initAdmin();
        initCategories();
    }

    private void initAdmin() {
        if (!userRepository.existsByEmail("admin@skillbridge.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@skillbridge.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .bio("Platform Administrator")
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin created — admin@skillbridge.com / Admin@123");
        }
    }

    private void initCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    Category.builder().name("Web Development").description("Frontend and backend web services").iconName("code").build(),
                    Category.builder().name("Mobile Development").description("iOS and Android app development").iconName("smartphone").build(),
                    Category.builder().name("Graphic Design").description("Logo, branding, and visual design").iconName("palette").build(),
                    Category.builder().name("Content Writing").description("Blog posts, copywriting, and SEO content").iconName("pen-line").build(),
                    Category.builder().name("Digital Marketing").description("SEO, social media, and ad campaigns").iconName("trending-up").build(),
                    Category.builder().name("Video Editing").description("Professional video production and editing").iconName("video").build(),
                    Category.builder().name("Data Science").description("Machine learning, analytics, and visualization").iconName("bar-chart").build(),
                    Category.builder().name("Cybersecurity").description("Penetration testing and security audits").iconName("shield").build()
            );
            categoryRepository.saveAll(categories);
            log.info("✅ 8 default categories initialized");
        }
    }
}
