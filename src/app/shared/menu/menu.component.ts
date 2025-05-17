import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../services/auth.service';
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
  
  constructor(public authService: AuthService) {
    this.isLoggedIn$ = authService.isLoggedIn();
    
    // Hibakereséshez
    this.isLoggedIn$.subscribe(status => {
      console.log('Login status changed:', status);
      console.log('LocalStorage:', localStorage.getItem('firebaseUser'));
    });
  }

  ngOnInit() {
    console.log('Initial auth check - isLoggedIn:', 
      localStorage.getItem('isLoggedIn'),
      'User data:', 
      localStorage.getItem('firebaseUser')
    );
  }
}