package com.bibliovault.api.repository;

import com.bibliovault.api.model.Member;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
