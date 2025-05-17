import { Component, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../shared/services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule, // Ez szükséges az *ngIf-hez
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule // A mat-button miatt szükséges
  ]
})
export class LoginComponent implements OnDestroy {
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const emailValue = this.loginForm.get('email')?.value || '';
  const passwordValue = this.loginForm.get('password')?.value || '';
  
  this.isLoading = true;
  this.showLoginForm = false;
  this.loginError = '';

  this.authService.signIn(emailValue, passwordValue)
    .then(userCredential => {
      console.log('Login successful:', userCredential.user);
      this.router.navigateByUrl('/');
      // localStorage.setItem('userEmail', emailValue); // Ez már felesleges, mert az AuthService tárolja
    })
    .catch(error => {
      console.error('Login error:', error);
      this.isLoading = false;
      this.showLoginForm = true;
      
      switch(error.code) {
        case 'auth/user-not-found':
          this.loginError = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          this.loginError = 'Incorrect password';
          break;
        case 'auth/invalid-credential':
          this.loginError = 'Invalid email or password';
          break;
        default:
          this.loginError = 'Authentication failed. Please try again later.';
      }
    });
}

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}