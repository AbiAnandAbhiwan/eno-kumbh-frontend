import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  phoneForm = this.formBuilder.group({
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  submitPhone() {
    if (this.phoneForm.valid) {
      this.router.navigate(['/otp']);
    }
  }
}
