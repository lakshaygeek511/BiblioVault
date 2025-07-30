package com.bibliovault.api.repository;

import com.bibliovault.api.model.Book;
import com.bibliovault.api.model.Lend;
import com.bibliovault.api.model.LendStatus;
import com.bibliovault.api.model.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LendRepository extends JpaRepository<Lend, Long> {
    List<Lend> findByMemberAndStatus(Member member, LendStatus status);
    List<Lend> findByMember(Member member);
    
    @Query("SELECT l.book.id FROM Lend l WHERE l.member = :member AND l.status = :status")
    List<Long> findBookIdsByMemberAndStatus(@Param("member") Member member, @Param("status") LendStatus status);
    
    @Query("SELECT CASE WHEN COUNT(l) > 0 THEN true ELSE false END FROM Lend l WHERE l.book = :book AND l.member = :member AND l.status = :status")
    boolean existsByBookAndMemberAndStatus(@Param("book") Book book, @Param("member") Member member, @Param("status") LendStatus status);
}
