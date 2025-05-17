import { Component } from '@angular/core';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent {
  tweetText: string = '';

  onTweetClick() {
    console.log('Tweet:', this.tweetText);
    // Itt majd el lehet küldeni szerverre is, stb.
    this.tweetText = '';
  }
}
