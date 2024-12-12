import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit{

  ngOnInit(): void {

    // this.userService.getAccessTokenForMappls().subscribe();
  }

  phoneNumber: string = '';
  message: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserServiceService) {}


  phoneForm = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  submitPhone() {
    if (this.phoneForm.valid) {
      this.phoneNumber = this.phoneForm.get('phoneNumber')?.value ?? '';

      // Call the service method to send OTP
      this.userService.sendOtp(this.phoneNumber).subscribe({
        next: (response) => {
          this.message = 'OTP sent successfully to your phone number!';
          localStorage.setItem('userPhoneNumber', this.phoneNumber);
          this.router.navigate(['/otp']);  // Navigate to OTP page on success
        },
        error: (error) => {
          if (error.status === 400) {
            this.message = 'Error sending OTP. Please try again later.';
          } else {
            this.message = JSON.stringify(error);;
          }
        }
      });
    }
  }
}
