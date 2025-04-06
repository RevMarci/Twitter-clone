import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Az URL paraméterek kezeléséhez
import { User } from '../../models/user.model'; // A User model importálása
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports : [MatIconModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Az id paraméter kiolvasása az URL-ből
    const userId = Number(this.route.snapshot.paramMap.get('id'));

    if (userId) {
      this.http.get<User[]>(`/assets/users.json`).subscribe(data => {
        this.user = data.find(user => user.id === userId);
      });
    }
  }
}
