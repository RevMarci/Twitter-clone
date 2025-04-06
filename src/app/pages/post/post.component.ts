import { Component } from '@angular/core';
import { Tweet } from '../../models/tweet.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.models';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { Like } from '../../models/like.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, MatBadgeModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  tweet: Tweet | undefined;
  tweetUser: User | undefined;
  comments: Comment[] = [];
  users: User[] = [];
  likes: Like[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const tweetId = Number(this.route.snapshot.paramMap.get('id'));

    if (tweetId) {
      this.http.get<Tweet[]>(`/assets/posts.json`).subscribe(data => {
        this.tweet = data.find(tweet => tweet.id === tweetId);
      });

      this.http.get<User[]>(`/assets/users.json`).subscribe(data => {
        this.tweetUser = data.find(user => user.id === this.tweet?.userId);
      });

      this.http.get<Comment[]>('/assets/comments.json').subscribe(data => {
        this.comments = data.filter(comment => comment.postId === this.tweet?.id);
      });

      this.http.get<User[]>('/assets/users.json').subscribe(data => {
        this.users = data;
      });

      this.http.get<Like[]>('/assets/likes.json').subscribe(data => {
        this.likes = data;
      });
    }
  }

  searchProfile(userId: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    console.log("User: " + userId);
    this.router.navigate(['profile', userId]);
  }

  getUserById(userId: number) {
    return this.users.find(user => user.id === userId);
  }

  getLikeAmount(postId: number | undefined) {
    return this.likes.find(like => like.postId === postId)?.likedBy.length || 0;
  }
}
