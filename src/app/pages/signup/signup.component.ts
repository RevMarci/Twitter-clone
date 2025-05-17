import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class SignupComponent implements OnDestroy {
  isLoading: boolean = false;
  signupError: string = '';
  showSignupForm: boolean = true;
  authSubscription?: Subscription;

  signupForm = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  confirmPassword: new FormControl('', [Validators.required])
}, { validators: this.passwordMatchValidator.bind(this) });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Jelszó egyezés ellenőrzése - típusos megvalósítás
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }

  async signup() {
  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched();
    return;
  }

  const name = this.signupForm.get('name')?.value || '';
  const email = this.signupForm.get('email')?.value || '';
  const password = this.signupForm.get('password')?.value || '';

  this.isLoading = true;
  this.showSignupForm = false;
  this.signupError = '';

  try {
    const userCredential = await this.authService.signUp(email, password, name);
    console.log('Registration successful:', userCredential.user);
    this.router.navigateByUrl('/');
  } catch (error: any) {
    console.error('Registration error:', error);
    this.isLoading = false;
    this.showSignupForm = true;

    switch (error.code) {
      case 'auth/email-already-in-use':
        this.signupError = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        this.signupError = 'Invalid email address';
        break;
      case 'auth/weak-password':
        this.signupError = 'Password is too weak';
        break;
      default:
        this.signupError = 'Registration failed. Please try again later.';
    }
  }
}


  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}