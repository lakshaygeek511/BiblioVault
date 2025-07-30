import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-bookupdate',
  templateUrl: './bookupdate.component.html',
  styleUrls: ['./bookupdate.component.css']
})
export class BookupdateComponent implements OnInit {
  authors;
  updateBookForm: FormGroup;
  updateSuccess;
  updateError;
  bookId;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.updateBookForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required, Validators.pattern(/^(?:ISBN(?:-1[03])?:?\s)?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\s]){3})[-\s0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\s]){4})[-\s0-9]{17}$)(?:97[89][-\s])?[0-9]{1,5}[-\s]?[0-9]+[-\s]?[0-9]+[-\s]?[0-9X]$/)]],
      authorId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAuthors();
    this.bookId = this.route.snapshot.params['id'];
    this.getBookDetails();
  }

  getAuthors() {
    this.apiService.getAllAuthors().subscribe(
      response => {
        this.authors = response;
      },
      error => {
        this.updateError = "Error loading authors";
        setTimeout(() => this.updateError = null, 3000);
      }
    );
  }

  getBookDetails() {
    this.apiService.readBook(this.bookId).subscribe(
      response => {
        this.updateBookForm.patchValue({
          name: response.name,
          isbn: response.isbn,
          authorId: response.author.id
        });
      },
      error => {
        this.updateError = "Error loading book details";
        setTimeout(() => this.updateError = null, 3000);
      }
    );
  }

  onSubmit(bookData) {
    if (this.updateBookForm.invalid) {
      this.updateError = this.getFormValidationErrors();
      setTimeout(() => this.updateError = null, 3000);
      return;
    }

    // Check if ISBN is already used
    this.apiService.checkIsbnExists(bookData.isbn, this.bookId).subscribe(
      exists => {
        if (exists) {
          this.updateError = "A book with this ISBN already exists";
          setTimeout(() => this.updateError = null, 3000);
          return;
        }
        this.updateBook(bookData);
      },
      error => {
        this.updateError = "Error checking ISBN availability";
        setTimeout(() => this.updateError = null, 3000);
      }
    );
  }

  private updateBook(bookData) {
    this.apiService.updateBook(this.bookId, bookData).subscribe(
      response => {
        this.updateSuccess = true;
        setTimeout(() => {
          this.updateSuccess = false;
          this.router.navigate(['/book']);
        }, 2000);
      },
      error => {
        this.updateError = error.error.message || "Error updating book";
        setTimeout(() => this.updateError = null, 3000);
      }
    );
  }

  getFormValidationErrors(): string {
    if (this.updateBookForm.get('name').errors?.required) {
      return "Book name is required";
    }
    if (this.updateBookForm.get('name').errors?.minlength) {
      return "Book name must be at least 2 characters long";
    }
    if (this.updateBookForm.get('isbn').errors?.required) {
      return "ISBN is required";
    }
    if (this.updateBookForm.get('isbn').errors?.pattern) {
      return "Invalid ISBN format. Please enter a valid ISBN-10 or ISBN-13";
    }
    if (this.updateBookForm.get('authorId').errors?.required) {
      return "Author selection is required";
    }
    return "Please check all required fields";
  }
}
