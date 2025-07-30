import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import _ from 'lodash';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  members;
  filteredMembers;
  memberSearch = '';
  books;
  filteredBooks;
  bookSearch = '';
  availableBooks;
  selectedBooks = []; // Books selected for lending (new selections)
  lentBooks = []; // Books currently lent to the member
  selectedMember;
  selectedMemberDetails;
  selectedBook;
  lendingStatus;
  lendingError;
  showLentBooks = false;
  showValidation = false;
  currentImage = 'assets/img/library.jpg';
  isImageSwapped = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getMembers();
    this.getBooks();
  }

  filterMembers() {
    if (!this.members) return;
    
    const search = this.memberSearch.toLowerCase();
    this.filteredMembers = this.members.filter(member => 
      member.firstName.toLowerCase().includes(search) ||
      member.lastName.toLowerCase().includes(search) ||
      (`BV${member.id}`).toLowerCase().includes(search)
    );
  }

  filterBooks() {
    const booksToFilter = this.availableBooks || this.books;
    if (!booksToFilter) return;
    
    const search = this.bookSearch.toLowerCase();
    this.filteredBooks = booksToFilter.filter(book => 
      book.name.toLowerCase().includes(search) ||
      book.isbn.toLowerCase().includes(search)
    );
  }

  selectMember(member) {
    this.selectedMember = member.id;
    this.selectedMemberDetails = member;
    this.memberSearch = '';
    this.onMemberSelect();
  }

  clearMember() {
    this.selectedMember = null;
    this.selectedMemberDetails = null;
    this.memberSearch = '';
    this.selectedBooks = [];
    this.lentBooks = [];
    this.showLentBooks = false;
    this.bookSearch = '';
  }

  selectBook(book) {
    if (!this.selectedMember) {
      this.lendingError = "Please select a member first";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    // Check if book is available
    const isAvailable = this.availableBooks?.some(b => b.id === book.id);
    if (!isAvailable) {
      this.lendingError = "This book is not available for lending";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    // Check if book is already selected
    const exists = this.selectedBooks.some(b => b.id === book.id);
    if (exists) {
      this.lendingError = "This book is already in your selection";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    // Check if book with same ISBN is already selected
    const sameIsbnExists = this.selectedBooks.some(b => b.isbn === book.isbn);
    if (sameIsbnExists) {
      this.lendingError = "A book with this ISBN is already selected";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    // Add book to selection
    this.selectedBooks.push(book);
    this.showLentBooks = false;
    this.bookSearch = '';
  }

  validateAndLend() {
    this.showValidation = true;
    
    if (!this.selectedMember) {
      this.lendingError = "Please select a member first";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    if (this.selectedBooks.length === 0) {
      this.lendingError = "Please select at least one book to lend";
      setTimeout(() => this.lendingError = null, 3000);
      return;
    }

    // Verify all selected books are still available
    const unavailableBooks = this.selectedBooks.filter(selected => 
      !this.availableBooks?.some(available => available.id === selected.id)
    );

    if (unavailableBooks.length > 0) {
      this.lendingError = "Some selected books are no longer available. Please refresh your selection.";
      setTimeout(() => this.lendingError = null, 3000);
      // Remove unavailable books from selection
      this.selectedBooks = this.selectedBooks.filter(selected => 
        this.availableBooks?.some(available => available.id === selected.id)
      );
      return;
    }

    this.lend();
  }

  getBooks() {
    this.apiService.readBooks().subscribe(
      response => {
        this.books = response;
        this.filteredBooks = response;
        console.log(JSON.stringify(response));
      },
      error => {
        console.log(error);
      }
    );
  }

  getMembers() {
    this.apiService.getMembers().subscribe(
      response => {
        this.members = response;
        this.filteredMembers = response;
        console.log(JSON.stringify(response));
      },
      error => {
        console.log(error);
      }
    );
  }

  onMemberSelect() {
    if (this.selectedMember) {
      this.showLentBooks = true;
      this.selectedBooks = []; // Clear selected books for new lending
      this.selectedBook = null;
      this.bookSearch = '';
      
      // Get currently lent books and store in separate array
      this.apiService.getMemberLentBooks(this.selectedMember).subscribe(
        response => {
          this.lentBooks = response; // Use separate array for lent books
        },
        error => {
          console.log('Error fetching member\'s lent books:', error);
        }
      );

      // Get available books for this member
      this.apiService.getAvailableBooksForMember(this.selectedMember).subscribe(
        response => {
          this.availableBooks = response;
          this.filteredBooks = response;
          // Clear any selected books that are no longer available
          this.selectedBooks = this.selectedBooks.filter(selected => 
            this.availableBooks.some(available => available.id === selected.id)
          );
        },
        error => {
          console.log('Error fetching available books:', error);
        }
      );
    } else {
      this.showLentBooks = false;
      this.selectedBooks = [];
      this.lentBooks = [];
      this.availableBooks = null;
      this.filteredBooks = this.books;
    }
  }

  addBook() {
    if (this.selectedBook) {
      console.log("Selected Member: " + this.selectedMember);
      console.log("Adding a Book: " + this.selectedBook.id);
      
      // Check if book is already in selectedBooks
      const exists = this.selectedBooks.some(book => book.id === this.selectedBook.id);
      if (!exists) {
        // Check if book is in availableBooks
        const isAvailable = this.availableBooks?.some(book => book.id === this.selectedBook.id);
        if (isAvailable) {
          this.selectedBooks.push(this.selectedBook);
          this.showLentBooks = false; // Switch to selected books view
          this.selectedBook = null;
          this.bookSearch = '';
        } else {
          this.lendingError = "This book is not available for lending";
          setTimeout(() => this.lendingError = null, 3000);
        }
      } else {
        this.lendingError = "This book is already in your selection";
        setTimeout(() => this.lendingError = null, 3000);
      }
    }
  }

  removeBook(bookId) {
    _.remove(this.selectedBooks, function(data) {
      return data.id == bookId;
    });
  }

  lend() {
    console.log("Initiating book lending");
    this.lendingError = null;

    let selectedIds = this.selectedBooks.map(book => book.id);

    const book_lending_request = {
      bookIds: selectedIds,
      memberId: this.selectedMember
    };

    console.log('Your lending request', book_lending_request);

    this.apiService.lendABook(book_lending_request).subscribe(
      response => {
        this.lendingStatus = true;
        this.selectedBooks = []; // Clear selected books after successful lending
        this.bookSearch = '';
        this.showValidation = false;
        
        // Refresh the member's lent books to include newly lent books
        this.onMemberSelect();
        
        setTimeout(() => {
          this.lendingStatus = false;
        }, 3000);
      },
      error => {
        this.lendingError = error.error.message || "Error occurred while lending books";
        setTimeout(() => {
          this.lendingError = null;
        }, 3000);
      }
    );
  }

  swapImage() {
    this.isImageSwapped = !this.isImageSwapped;
  }
}