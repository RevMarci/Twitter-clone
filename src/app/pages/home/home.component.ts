import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // json beolvasashoz kell
import { CommonModule } from '@angular/common'; // ha NgIf-et vagy más Angular pipe-ot használsz a HTML-ben
import { User } from '../../models/user.model';
import { Tweet } from '../../models/tweet.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  tweets: Tweet[] = [];
  users: User[] = [];

  ngOnInit(): void {
    this.http.get<Tweet[]>('/assets/posts.json').subscribe(data => {
      this.tweets = data;
    });

    this.http.get<User[]>('/assets/users.json').subscribe(data => {
      this.users = data;
    });
  }

  getUserByID(id: number) {
    return this.users.find(user => user.id === id);
  }

  
  searchProfile(userId: number) {
    console.log(userId);
    this.router.navigate(['profile', userId]);
  }
}