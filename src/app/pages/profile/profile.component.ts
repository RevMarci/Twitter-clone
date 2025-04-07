import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Az URL paraméterek kezeléséhez
import { User } from '../../models/user.model'; // A User model importálása
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Tweet } from '../../models/tweet.model';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.models';
import { MatBadgeModule } from '@angular/material/badge';
import { ShortenPipe } from '../../pipes/shorten.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports : [CommonModule, MatIconModule, RouterModule, MatBadgeModule, ShortenPipe],
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
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Az id paraméter kiolvasása az URL-ből
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (userId) {
      this.http.get<User[]>(`/assets/users.json`).subscribe(data => {
        this.user = data.find(user => user.id === userId);
      });

      this.http.get<Tweet[]>('/assets/posts.json').subscribe(data => {
        this.tweets = data.filter(tweet => tweet.userId === this.user?.id);
      });

      this.http.get<Like[]>('/assets/likes.json').subscribe(data => {
        this.likes = data;
      });
  
      this.http.get<Comment[]>('/assets/comments.json').subscribe(data => {
        this.comments = data;
      });
    }
  }

  getLikeAmount(postId: number) {
    return this.likes.find(like => like.postId === postId)?.likedBy.length || 0;
  }

  getCommentAmount(postId: number): number {
    return this.comments.filter(comment => comment.postId === postId).length;
  }

  searchTweet(id: number) {
    console.log("Tweet: " + id)
    this.router.navigate(['post', id]);
  }
}
