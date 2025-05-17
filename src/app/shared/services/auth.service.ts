import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential
} from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  private readonly USER_STORAGE_KEY = 'firebaseUser';

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.currentUser$ = authState(this.auth);
  }

  private updateUserStorage(user: User | null): void {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      localStorage.setItem('isLoggedIn', 'false');
    }
  }

  async signUp(email: string, password: string, name: string): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  this.updateUserStorage(user);

  const userRef = doc(this.firestore, `users/${user.uid}`);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    name: name,
    pfp: 'https://pbs.twimg.com/profile_images/1757203362381168640/j9704gu__400x400.jpg',
    banner: 'https://pbs.twimg.com/profile_banners/1686901686185721857/1717108459/1500x500'
  });

  return userCredential;
}


  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.updateUserStorage(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.updateUserStorage(null);
      this.router.navigateByUrl('/home');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user) // Átalakítjuk boolean értékké
    );
  }

  async getCurrentUser(): Promise<User | null> {
    return await firstValueFrom(this.currentUser$);
  }

  getCurrentUserId(): string | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    return userData ? JSON.parse(userData).uid : null;
  }

  getCurrentUserEmail(): string | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    return userData ? JSON.parse(userData).email : null;
  }
}