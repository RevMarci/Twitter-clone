import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // json beolvasashoz kell
import { CommonModule } from '@angular/common'; // ha NgIf-et vagy más Angular pipe-ot használsz a HTML-ben
import { User } from '../../models/user.model';
import { Tweet } from '../../models/tweet.model';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Like } from '../../models/like.model';
import { Comment } from '../../models/comment.models';
import { MatCardModule } from '@angular/material/card';
import { ShortenPipe } from '../../pipes/shorten.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, MatCardModule, ShortenPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  tweets: Tweet[] = [];
  users: User[] = [];
  likes: Like[] = [];
  comments: Comment[] = [];

  ngOnInit(): void {
    this.http.get<Tweet[]>('/assets/posts.json').subscribe(data => {
      this.tweets = data;
    });

    this.http.get<User[]>('/assets/users.json').subscribe(data => {
      this.users = data;
    });

    this.http.get<Like[]>('/assets/likes.json').subscribe(data => {
      this.likes = data;
    });

    this.http.get<Comment[]>('/assets/comments.json').subscribe(data => {
      this.comments = data;
    });
  }

  getUserByID(id: string) {
    return this.users.find(user => user.id === id);
  }
  
  searchProfile(userId: string, event: MouseEvent) {
    event.stopPropagation();
    console.log("User: " + userId);
    this.router.navigate(['profile', userId]);
  }

  searchTweet(id: string) {
    console.log("Tweet: " + id)
    this.router.navigate(['post', id]);
  }

  getLikeAmount(postId: string) {
    return this.likes.find(like => like.postId === postId)?.likedBy.length || 0;
  }

  getCommentAmount(postId: string): number {
    return this.comments.filter(comment => comment.postId === postId).length;
  }
}