package com.musify.backend.config;

import com.musify.backend.entity.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAwareImpl")
public class AuditorAwareImpl implements AuditorAware<String>{

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal().equals("anonymousUser")) {
            return Optional.of("Anonymous User");
        }

        Object principal = authentication.getPrincipal();
        String email;

        if (principal instanceof User user) {
            email = user.getEmail();
        } else {
            email = principal.toString();
        }

        return Optional.of(email);
    }
}
