import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { Firestore, collection, doc, collectionData, docData } from '@angular/fire/firestore';
import { Observable, combineLatest, map, of } from 'rxjs';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { AuthService } from '../../shared/services/auth.service';

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
    ShortenPipe
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | undefined> = of(undefined);
  tweets$: Observable<Post[]> = of([]);
  likes$: Observable<Like[]> = of([]);
  comments$: Observable<Comment[]> = of([]);
  
  combinedData$: Observable<{
    user: User | undefined,
    tweets: Post[],
    likes: Like[],
    comments: Comment[]
  }> = of({
    user: undefined,
    tweets: [],
    likes: [],
    comments: []
  });

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService // AuthService hozzáadva a konstruktorhoz
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id') || this.authService.getCurrentUserId();
    
    if (userId) {
      // Felhasználó adatai
      const userRef = doc(this.firestore, `users/${userId}`);
      this.user$ = docData(userRef) as Observable<User>;

      // Felhasználó tweetjei
      const postsRef = collection(this.firestore, 'posts');
      this.tweets$ = collectionData(postsRef, { idField: 'id' }).pipe(
        map(posts => (posts as Post[]).filter(post => post.userId === userId)
      ));

      // Like-ok
      const likesRef = collection(this.firestore, 'likes');
      this.likes$ = collectionData(likesRef, { idField: 'id' }) as Observable<Like[]>;

      // Kommentek
      const commentsRef = collection(this.firestore, 'comments');
      this.comments$ = collectionData(commentsRef, { idField: 'id' }) as Observable<Comment[]>;

      // Összesített adatok
      this.combinedData$ = combineLatest([
        this.user$,
        this.tweets$,
        this.likes$,
        this.comments$
      ]).pipe(
        map(([user, tweets, likes, comments]) => ({
          user,
          tweets,
          likes,
          comments
        }))
      );
    } else {
      console.error('No user ID available');
      this.router.navigate(['/']); // Átirányítás, ha nincs user ID
    }
  }

  getLikeAmount(likes: Like[], postId: string): number {
    const like = likes?.find(l => l.postId === postId);
    return like ? like.likedBy.length : 0;
  }

  getCommentAmount(comments: Comment[], postId: string): number {
    return comments?.filter(comment => comment.postId === postId).length || 0;
  }

  searchTweet(id: string) {
    this.router.navigate(['post', id]);
  }
}