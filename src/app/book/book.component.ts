import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  books;
  authors;
  registerBookForm: FormGroup;
  deletionStatus;
  registrationSuccess;
  registrationError;
  currentImage = 'assets/img/book.jpg';
  isImageSwapped = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.registerBookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^(?:ISBN(?:-1[03])?:?\s)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\s]){3})[-\s0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)(?:97[89][-\s])?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X]$/)]],
      authorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAuthors();
    this.getBooks();
  }
  

  getAuthors() {
    this.apiService.getAllAuthors().subscribe(
      response => {
        this.authors = response;
      },
      error => {
        this.registrationError = "Error loading authors";
        setTimeout(() => this.registrationError = null, 3000);
      }
    );
  }

  onSubmit(bookData) {
    if (this.registerBookForm.invalid) {
      this.registrationError = this.getFormValidationErrors();
      setTimeout(() => this.registrationError = null, 3000);
      return;
    }

    // Check if ISBN is already used
    this.apiService.checkIsbnExists(bookData.isbn).subscribe(
      exists => {
        if (exists) {
          this.registrationError = "A book with this ISBN already exists";
          setTimeout(() => this.registrationError = null, 3000);
          return;
        }
        this.registerBook(bookData);
      },
      error => {
        this.registrationError = "Error checking ISBN availability";
        setTimeout(() => this.registrationError = null, 3000);
      }
    );
  }

  private registerBook(bookData) {
    this.apiService.createBook(bookData).subscribe(
      response => {
        console.log("Book creation successful" + response.id);
        this.getBooks();
        this.registrationSuccess = true;
        this.registerBookForm.reset();
        setTimeout(() => {
          this.registrationSuccess = false;
        }, 3000);
      },
      error => {
        this.registrationError = error.error.message || "Error in book registration";
        setTimeout(() => this.registrationError = null, 3000);
      }
    );
  }

  getFormValidationErrors(): string {
    if (this.registerBookForm.get('name').errors?.required) {
      return "Book name is required";
    }
    if (this.registerBookForm.get('name').errors?.minlength) {
      return "Book name must be at least 2 characters long";
    }
    if (this.registerBookForm.get('isbn').errors?.required) {
      return "ISBN is required";
    }
    if (this.registerBookForm.get('isbn').errors?.pattern) {
      return "Invalid ISBN format. Please enter a valid ISBN-10 or ISBN-13";
    }
    if (this.registerBookForm.get('authorId').errors?.required) {
      return "Author selection is required";
    }
    return "Please check all required fields";
  }


  getBooks() {
    this.apiService.readBooks().subscribe(response=>{
      this.books = response;
      console.log(JSON.stringify(response));
    },
    error=>{
      console.log(error)
    })
  }

  deleteBook(bookId) {
    console.log("Deleting book ", bookId);
    this.apiService.removeBook(bookId).subscribe(response => {
      console.log("Book deletion success"+response)
      this.getBooks();
      this.deletionStatus = true;
      setTimeout(() => {
        this.deletionStatus = false;
      }, 3500);
    });
  }

  swapImage() {
    this.isImageSwapped = !this.isImageSwapped;
  }

}
