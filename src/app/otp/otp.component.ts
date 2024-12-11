import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent {

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  otpForm = this.formBuilder.group({
    otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  verifyOtp() {
    if (this.otpForm.valid) {
      this.router.navigate(['/categories']);
    }
  }
}
