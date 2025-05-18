import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { Firestore, collection, doc, collectionData, docData, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable, firstValueFrom } from 'rxjs';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { MatSpinner } from '@angular/material/progress-spinner';

interface User {
  uid: string;
  name: string;
  email: string;
  pfp: string;
  banner: string;
}

interface Post {
  id: string;
  content: string;
  userId: string;
}

interface Like {
  id: string;
  likedBy: string[];
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatBadgeModule,
    MatSpinner,
    ShortenPipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  tweets: Post[] = [];
  likes: Like[] = [];
  comments: Comment[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 5;
  hasMoreTweets = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id') || this.authService.getCurrentUserId();
    
    if (!userId) {
      this.router.navigate(['/']);
      return;
    }

    try {
      // 1. Felhasználó adatok betöltése
      const userRef = doc(this.firestore, `users/${userId}`);
      const userData = await firstValueFrom(docData(userRef));
      this.user = userData as User;

      // 2. Posztok betöltése
      await this.loadTweets(userId);

      // 3. Like-ok betöltése
      if (this.tweets.length > 0) {
        const likesQuery = query(
          collection(this.firestore, 'likes'),
          where('postId', 'in', this.tweets.map(t => t.id))
        );
        const likesData = await firstValueFrom(collectionData(likesQuery, { idField: 'id' }));
        this.likes = likesData as Like[];
      }

      // 4. Kommentek betöltése
      const commentsQuery = query(
        collection(this.firestore, 'comments'),
        where('userId', '==', userId)
      );
      const commentsData = await firstValueFrom(collectionData(commentsQuery, { idField: 'id' }));
      this.comments = commentsData as Comment[];

    } catch (error) {
      console.error('Hiba történt:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadTweets(userId: string): Promise<void> {
    try {
      const postsQuery = query(
        collection(this.firestore, 'posts'),
        where('userId', '==', userId),
        orderBy('id', 'desc'),
        limit(this.pageSize)
      );

      const snapshot = await firstValueFrom(collectionData(postsQuery, { idField: 'id' }));
      this.tweets = snapshot as Post[];
      this.hasMoreTweets = this.tweets.length === this.pageSize;

    } catch (error) {
      console.error('Error loading tweets:', error);
      this.tweets = [];
    }
  }

  loadMoreTweets(): void {
    if (!this.user) return;
    this.currentPage++;
    // Egyszerűsített változat - a teljes oldaltöréshez további fejlesztés kell
    this.loadTweets(this.user.uid);
  }

  getLikeAmount(postId: string): number {
    const likeDoc = this.likes.find(like => like.postId === postId);
    return likeDoc ? likeDoc.likedBy.length : 0;
  }

  getCommentAmount(postId: string): number {
    return this.comments.filter(comment => comment.postId === postId).length;
  }

  searchTweet(id: string): void {
    this.router.navigate(['post', id]);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}