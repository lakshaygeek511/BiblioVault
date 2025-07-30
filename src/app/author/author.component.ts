import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  authors;
  authorRegistrationForm: FormGroup;
  registrationSuccess;
  registrationError;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.authorRegistrationForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]]
    });
  }

  ngOnInit(): void {
    this.getAuthors();    
  }

  getAuthors() {
    this.apiService.getAllAuthors().subscribe(response=>{
      this.authors = response;
      console.log(JSON.stringify(response));
    },
    error=>{
      console.log(error)
    })
  }

  onSubmit(authorData) {
    if (this.authorRegistrationForm.invalid) {
      this.registrationError = this.getFormValidationErrors();
      setTimeout(() => this.registrationError = null, 3000);
      return;
    }

    const user_register_data = {
      firstName: authorData.firstname,
      lastName: authorData.lastname
    };

    this.apiService.createAuthor(user_register_data).subscribe(
      response => {
        console.log("Author creation successful" + response.id);
      this.getAuthors();
        this.registrationSuccess = true;
        this.authorRegistrationForm.reset();
        setTimeout(() => {
          this.registrationSuccess = false;
        }, 3000);
      },
      error => {
        this.registrationError = error.error.message || "Error in author registration";
        setTimeout(() => this.registrationError = null, 3000);
      }
    );
  }

  getFormValidationErrors(): string {
    if (this.authorRegistrationForm.get('firstname').errors?.required) {
      return "First name is required";
    }
    if (this.authorRegistrationForm.get('firstname').errors?.minlength) {
      return "First name must be at least 2 characters long";
    }
    if (this.authorRegistrationForm.get('firstname').errors?.pattern) {
      return "First name can only contain letters and spaces";
    }
    if (this.authorRegistrationForm.get('lastname').errors?.required) {
      return "Last name is required";
    }
    if (this.authorRegistrationForm.get('lastname').errors?.minlength) {
      return "Last name must be at least 2 characters long";
    }
    if (this.authorRegistrationForm.get('lastname').errors?.pattern) {
      return "Last name can only contain letters and spaces";
    }
    return "Please check all required fields";
  }
}
