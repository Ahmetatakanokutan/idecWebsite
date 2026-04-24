package com.example.idectt.repository;

import com.example.idectt.entity.ERole;
import com.example.idectt.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByVerificationCode(String verificationCode);
    Boolean existsByUsername(String username);
    long countByRolesRoleName(ERole roleName);
}
