package com.bibliovault.api.service;

import com.bibliovault.api.model.*;
import com.bibliovault.api.model.request.AuthorCreationRequest;
import com.bibliovault.api.model.request.BookCreationRequest;
import com.bibliovault.api.model.request.BookLendRequest;
import com.bibliovault.api.model.request.MemberCreationRequest;
import com.bibliovault.api.repository.AuthorRepository;
import com.bibliovault.api.repository.BookRepository;
import com.bibliovault.api.repository.LendRepository;
import com.bibliovault.api.repository.MemberRepository;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final AuthorRepository authorRepository;
    private final MemberRepository memberRepository;
    private final LendRepository lendRepository;
    private final BookRepository bookRepository;

    public Book readBook(Long id) {
        Optional<Book> book = bookRepository.findById(id);
        if (book.isPresent()) {
            return book.get();
        }
        throw new EntityNotFoundException("Cant find any book under given ID");
    }

    public List<Book> readBooks() {
        return bookRepository.findAll();
    }

    public Book readBook(String isbn) {
        Optional<Book> book = bookRepository.findByIsbn(isbn);
        if (book.isPresent()) {
            return book.get();
        }
        throw new EntityNotFoundException("Cant find any book under given ISBN");
    }

    public boolean isIsbnExists(String isbn, Long excludeBookId) {
        Optional<Book> existingBook = bookRepository.findByIsbn(isbn);
        if (!existingBook.isPresent()) {
            return false;
        }
        if (excludeBookId != null) {
            return !existingBook.get().getId().equals(excludeBookId);
        }
        return true;
    }

    public Book createBook(BookCreationRequest book) {
        Optional<Author> author = authorRepository.findById(book.getAuthorId());
        if (!author.isPresent()) {
            throw new EntityNotFoundException("Author Not Found");
        }

        Optional<Book> existingBook = bookRepository.findByIsbn(book.getIsbn());
        if (existingBook.isPresent()) {
            throw new RuntimeException("A book with this ISBN already exists");
        }

        Book bookToCreate = new Book();
        BeanUtils.copyProperties(book, bookToCreate);
        bookToCreate.setAuthor(author.get());
        return bookRepository.save(bookToCreate);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public Member createMember(MemberCreationRequest request) {
        Member member = new Member();
        BeanUtils.copyProperties(request, member);
        member.setStatus(MemberStatus.ACTIVE);
        return memberRepository.save(member);
    }

    public Member updateMember (Long id, MemberCreationRequest request) {
        Optional<Member> optionalMember = memberRepository.findById(id);
        if (!optionalMember.isPresent()) {
            throw new EntityNotFoundException("Member not present in the database");
        }
        Member member = optionalMember.get();
        member.setLastName(request.getLastName());
        member.setFirstName(request.getFirstName());
        return memberRepository.save(member);
    }

    public Author createAuthor (AuthorCreationRequest request) {
        Author author = new Author();
        BeanUtils.copyProperties(request, author);
        return authorRepository.save(author);
    }

    public List<Book> getAvailableBooksForMember(Long memberId) {
        Optional<Member> member = memberRepository.findById(memberId);
        if (!member.isPresent()) {
            throw new EntityNotFoundException("Member not found");
        }

        // Get all books
        List<Book> allBooks = bookRepository.findAll();
        
        // Get books already lent to this member
        List<Long> lentBookIds = lendRepository.findBookIdsByMemberAndStatus(member.get(), LendStatus.BURROWED);
        
        // Filter out books already lent to this member
        return allBooks.stream()
                .filter(book -> !lentBookIds.contains(book.getId()))
                .collect(Collectors.toList());
    }

    public List<Book> getLentBooksByMember(Long memberId) {
        Optional<Member> member = memberRepository.findById(memberId);
        if (!member.isPresent()) {
            throw new EntityNotFoundException("Member not found");
        }
        List<Lend> lends = lendRepository.findByMemberAndStatus(member.get(), LendStatus.BURROWED);
        List<Book> books = new ArrayList<>();
        lends.forEach(lend -> books.add(lend.getBook()));
        return books;
    }

    public List<String> lendABook(BookLendRequest request) {
        if (request.getBookIds() == null || request.getBookIds().isEmpty()) {
            throw new RuntimeException("No books selected for lending");
        }

        Optional<Member> memberForId = memberRepository.findById(request.getMemberId());
        if (!memberForId.isPresent()) {
            throw new EntityNotFoundException("Member not present in the database");
        }

        Member member = memberForId.get();
        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new RuntimeException("User is not active to proceed a lending.");
        }

        List<String> booksApprovedToBurrow = new ArrayList<>();

        request.getBookIds().forEach(bookId -> {
            Optional<Book> bookForId = bookRepository.findById(bookId);
            if (!bookForId.isPresent()) {
                throw new EntityNotFoundException("Can't find any book under given ID: " + bookId);
            }

            Book book = bookForId.get();
            
            // Check if this member already has this book
            boolean alreadyLent = lendRepository.existsByBookAndMemberAndStatus(book, member, LendStatus.BURROWED);
            
            if (!alreadyLent) {
                booksApprovedToBurrow.add(book.getName());
                Lend lend = new Lend();
                lend.setMember(member);
                lend.setBook(book);
                lend.setStatus(LendStatus.BURROWED);
                lend.setStartOn(Instant.now());
                lend.setDueOn(Instant.now().plus(30, ChronoUnit.DAYS));
                lendRepository.save(lend);
            } else {
                throw new RuntimeException("Book '" + book.getName() + "' is already lent to this member");
            }
        });

        if (booksApprovedToBurrow.isEmpty()) {
            throw new RuntimeException("None of the selected books are available for lending");
        }

        return booksApprovedToBurrow;
    }


    public List<Author> readAuthors() {
        return authorRepository.findAll();
    }

    public Book updateBook(Long bookId, BookCreationRequest request) {
        Optional<Author> author = authorRepository.findById(request.getAuthorId());
        if (!author.isPresent()) {
            throw new EntityNotFoundException("Author Not Found");
        }

        Optional<Book> optionalBook = bookRepository.findById(bookId);
        if (!optionalBook.isPresent()) {
            throw new EntityNotFoundException("Book Not Found");
        }

        // Check if ISBN is already used by another book
        Optional<Book> existingBook = bookRepository.findByIsbn(request.getIsbn());
        if (existingBook.isPresent() && !existingBook.get().getId().equals(bookId)) {
            throw new RuntimeException("A book with this ISBN already exists");
        }

        Book book = optionalBook.get();
        book.setIsbn(request.getIsbn());
        book.setName(request.getName());
        book.setAuthor(author.get());
        return bookRepository.save(book);
    }

    public List<Member> readMembers() {
        return memberRepository.findAll();
    }
}
