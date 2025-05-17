import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { User } from '../../models/user.model';
import { Tweet } from '../../models/tweet.model';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.models';
import { ShortenPipe } from '../../pipes/shorten.pipe';

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
  user: User | undefined;
  tweets: Tweet[] = [];
  likes: Like[] = [];
  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
      // Felhasználó Firestore-ból
      this.firestore.collection<User>('users').doc(userId).valueChanges().subscribe(data => {
        this.user = data;
      });

      // Tweetek Firestore-ból
      this.firestore.collection<Tweet>('posts', ref => ref.where('userId', '==', userId))
        .valueChanges({ idField: 'id' }).subscribe(data => {
          this.tweets = data;
        });

      // Like-ok Firestore-ból
      this.firestore.collection<Like>('likes').valueChanges().subscribe(data => {
        this.likes = data;
      });

      // Kommentek Firestore-ból
      this.firestore.collection<Comment>('comments').valueChanges().subscribe(data => {
        this.comments = data;
      });
    }
  }

  getLikeAmount(postId: string) {
    return this.likes.find(like => like.postId === postId)?.likedBy.length || 0;
  }

  getCommentAmount(postId: string): number {
    return this.comments.filter(comment => comment.postId === postId).length;
  }

  searchTweet(id: string) {
    this.router.navigate(['post', id]);
  }
}
