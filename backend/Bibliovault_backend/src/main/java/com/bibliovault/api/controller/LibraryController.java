package com.bibliovault.api.controller;

import com.bibliovault.api.model.Author;
import com.bibliovault.api.model.Book;
import com.bibliovault.api.model.Member;
import com.bibliovault.api.model.request.AuthorCreationRequest;
import com.bibliovault.api.model.request.BookCreationRequest;
import com.bibliovault.api.model.request.BookLendRequest;
import com.bibliovault.api.model.request.MemberCreationRequest;
import com.bibliovault.api.service.LibraryService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/api/library")
@RequiredArgsConstructor
@CrossOrigin("*")
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping("/book")
    public ResponseEntity readBooks(@RequestParam(required = false) String isbn) {
        if (isbn == null) {
            return ResponseEntity.ok(libraryService.readBooks());
        }
        return ResponseEntity.ok(libraryService.readBook(isbn));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<Book> readBook (@PathVariable Long bookId) {
        return ResponseEntity.ok(libraryService.readBook(bookId));
    }

    @PostMapping("/book")
    public ResponseEntity<Book> createBook (@RequestBody BookCreationRequest request) {
        return ResponseEntity.ok(libraryService.createBook(request));
    }


    @PatchMapping("/book/{bookId}")
    public ResponseEntity<Book> updateBook (@PathVariable("bookId") Long bookId, @RequestBody BookCreationRequest request) {
        return ResponseEntity.ok(libraryService.updateBook(bookId, request));
    }

    @PostMapping("/author")
    public ResponseEntity<Author> createAuthor (@RequestBody AuthorCreationRequest request) {
        return ResponseEntity.ok(libraryService.createAuthor(request));
    }

    @GetMapping("/author")
    public ResponseEntity<List<Author>> readAuthors () {
        return ResponseEntity.ok(libraryService.readAuthors());
    }

    @DeleteMapping("/book/{bookId}")
    public ResponseEntity<Void> deleteBook (@PathVariable Long bookId) {
        libraryService.deleteBook(bookId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/member")
    public ResponseEntity<Member> createMember (@RequestBody MemberCreationRequest request) {
        return ResponseEntity.ok(libraryService.createMember(request));
    }

    @GetMapping("/member")
    public ResponseEntity<List<Member>> readMembers () {
        return ResponseEntity.ok(libraryService.readMembers());
    }

    @PatchMapping("/member/{memberId}")
    public ResponseEntity<Member> updateMember (@RequestBody MemberCreationRequest request, @PathVariable Long memberId) {
        return ResponseEntity.ok(libraryService.updateMember(memberId, request));
    }

    @GetMapping("/member/{memberId}/lentbooks")
    public ResponseEntity<List<Book>> getLentBooksByMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(libraryService.getLentBooksByMember(memberId));
    }

    @GetMapping("/member/{memberId}/availablebooks")
    public ResponseEntity<List<Book>> getAvailableBooksForMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(libraryService.getAvailableBooksForMember(memberId));
    }

    @PostMapping("/book/lend")
    public ResponseEntity<List<String>> lendABook(@RequestBody BookLendRequest bookLendRequests) {
        return ResponseEntity.ok(libraryService.lendABook(bookLendRequests));
    }

    @GetMapping("/book/check-isbn/{isbn}")
    public ResponseEntity<Boolean> checkIsbnExists(@PathVariable String isbn, @RequestParam(required = false) Long excludeBookId) {
        return ResponseEntity.ok(libraryService.isIsbnExists(isbn, excludeBookId));
    }

}
