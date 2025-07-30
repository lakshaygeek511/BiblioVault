import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  members;
  memberRegistrationForm: FormGroup;
  registrationSuccess;
  registrationError;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
      this.memberRegistrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]*$/)]]
      });
    }

  ngOnInit(): void {
    this.getMembers();
  }
  getMembers() {
    this.apiService.getMembers().subscribe(response=>{
      this.members = response;
      console.log(JSON.stringify(response));
    },
    error=>{
      console.log(error)
    })
  }

  onSubmit(memberData) {
    if (this.memberRegistrationForm.invalid) {
      this.registrationError = this.getFormValidationErrors();
      setTimeout(() => this.registrationError = null, 3000);
      return;
    }

    this.apiService.createAMember(memberData).subscribe(
      response => {
        console.log("Member creation successful" + response.id);
        this.getMembers();
        this.registrationSuccess = true;
    this.memberRegistrationForm.reset();
        setTimeout(() => {
          this.registrationSuccess = false;
        }, 3000);
      },
      error => {
        this.registrationError = error.error.message || "Error in member registration";
        setTimeout(() => this.registrationError = null, 3000);
      }
    );
  }

  getFormValidationErrors(): string {
    if (this.memberRegistrationForm.get('firstName').errors?.required) {
      return "First name is required";
    }
    if (this.memberRegistrationForm.get('firstName').errors?.minlength) {
      return "First name must be at least 2 characters long";
    }
    if (this.memberRegistrationForm.get('firstName').errors?.pattern) {
      return "First name can only contain letters and spaces";
    }
    if (this.memberRegistrationForm.get('lastName').errors?.required) {
      return "Last name is required";
    }
    if (this.memberRegistrationForm.get('lastName').errors?.minlength) {
      return "Last name must be at least 2 characters long";
    }
    if (this.memberRegistrationForm.get('lastName').errors?.pattern) {
      return "Last name can only contain letters and spaces";
    }
    return "Please check all required fields";
  }
}
