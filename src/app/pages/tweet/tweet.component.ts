import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
})
export class TweetComponent {
  tweetText: string = '';
  isPosting = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {}

  async onTweetClick() {
    try {
      this.isPosting = true;
      const currentUser = await this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      if (!this.tweetText?.trim()) {
        alert('Kérjük írjon be tartalmat a tweethez!');
        return;
      }

      const tweetId = uuidv4();

      const tweetData = {
        content: this.tweetText.trim(),
        id: tweetId,
        userId: currentUser.uid
      };

      const tweetDocRef = doc(this.firestore, 'posts', tweetId);
      
      await setDoc(tweetDocRef, tweetData);

      console.log('Tweet sikeresen elküldve! ID:', tweetId);
      this.tweetText = '';
      this.router.navigate(['/']);
      
    } catch (error) {
      console.error('Hiba a tweet küldésekor:', error);
      alert('Hiba történt a tweet küldése során!');
    } finally {
      this.isPosting = false;
    }
  }
}