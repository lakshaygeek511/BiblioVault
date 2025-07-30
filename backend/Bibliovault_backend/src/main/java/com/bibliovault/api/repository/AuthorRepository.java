package com.bibliovault.api.repository;

import com.bibliovault.api.model.Author;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
