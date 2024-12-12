import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit{

  phoneNumber: string = '';
  otp: string = '';
  message: string = '';
  retryCount: number = 0;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserServiceService) {}
  ngOnInit(): void {
    this.phoneNumber = localStorage.getItem('userPhoneNumber') || '';
  }



  otpForm = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
  });

  verifyOtp(): void {
    if (this.otpForm.valid) {
      // Get OTP value from the form
      this.otp = this.otpForm.get('otp')?.value ?? '';

      // Call the verifyOtp service method
      this.userService.verifyOtp(this.phoneNumber, this.otp).subscribe({
        next: (response) => {
          // Handle success response
          if (response && response.status === 200) { // Check HTTP status code
            this.message = response.body?.message || 'OTP verified successfully!';
            this.router.navigate(['/categories']); // Navigate to categories on success
          } else {
            this.message = 'Unexpected response format.';
          }
        },
        error: (error) => {
          // Handle error response
          localStorage.setItem('error', JSON.stringify(error));
          switch (error.status) {
            case 404:
              this.message = 'Phone number not found.';
              break;
            case 406:
              this.message = 'Retry limit exceeded. Please try again later.';
              break;
            case 401:
              const retryCount = error.error?.error?.text ?? 'unknown';
              this.message = `Invalid OTP. Retry number: ${retryCount}.`;
              break;
            default:
              this.message = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      this.message = 'Please enter a valid OTP.';
    }
  }

  verifyOtp2(){
    this.otp = this.otpForm.get('otp')?.value ?? '';

  }



}
