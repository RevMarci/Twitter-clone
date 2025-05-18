import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { MatSpinner } from '@angular/material/progress-spinner';

interface User {
  uid: string;
  name: string;
  pfp: string;
}

interface Post {
  id: string;
  content: string;
  userId: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatBadgeModule,
    MatCardModule,
    MatSpinner,
    ShortenPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  users: User[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // 1. Posztok betöltése
      const postsQuery = query(
        collection(this.firestore, 'posts')
      );
      this.posts = await firstValueFrom(collectionData(postsQuery, { idField: 'id' })) as Post[];
      
      console.log('Betöltött posztok:', this.posts);

      // 2. Felhasználók betöltése
      const usersQuery = query(
        collection(this.firestore, 'users')
      );
      this.users = await firstValueFrom(collectionData(usersQuery, { idField: 'uid' })) as User[];

    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.uid === userId);
  }

  searchProfile(userId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.router.navigate(['profile', userId]);
  }

  searchTweet(id: string): void {
    this.router.navigate(['post', id]);
  }
}