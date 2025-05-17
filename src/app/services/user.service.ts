import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../shared/services/auth.service';
import { switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  getUserData() {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        }
        return of(null);
      })
    );
  }

  async createOrUpdateUser(userData: any) {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Nincs bejelentkezett felhasználó!');
    
    return this.firestore.collection('users').doc(user.uid).set(userData, { merge: true });
  }

  /*
  async deleteUser() {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('Nincs bejelentkezett felhasználó!');
    
    return this.firestore.collection('users').doc(user.uid).delete();
  }*/

  getCurrentUserId() {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        return of(user ? user.uid : null);
      })
    );
  }

  getCurrentUserEmail() {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        return of(user ? user.email : null);
      })
    );
  }

  getCurrentUserProfile() {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('profiles').doc(user.uid).valueChanges();
        }
        return of(null);
      })
    );
  }
}