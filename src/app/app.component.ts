import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { MenuComponent } from "./shared/menu/menu.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { PostComponent } from "./pages/post/post.component";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, MenuComponent, ProfileComponent, PostComponent, LoginComponent, SignupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, private http: HttpClient) {}

  title = 'twitter';
  page = 'home';
  viewProfile = 0;
}
