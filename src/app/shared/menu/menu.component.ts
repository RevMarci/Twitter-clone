import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule, RouterModule, MatListModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  currentUserId$: Observable<string | undefined>;

  constructor(public authService: AuthService) {
    // Initialize properties in constructor
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.currentUserId$ = this.authService.currentUser$.pipe(
      map(user => user?.uid)
    );
  }

  ngOnInit() {
    // this.isLoggedIn$.subscribe(status => console.log('Login status:', status));
    // this.currentUserId$.subscribe(id => console.log('Current user ID:', id));
  }
}