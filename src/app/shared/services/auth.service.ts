import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable, firstValueFrom, map, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_STORAGE_KEY = 'firebaseUser';
  currentUser$: Observable<User | null>;
  
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.currentUser$ = authState(this.auth).pipe(
      tap(user => {
        this.updateUserStorage(user);
        // console.log('Auth state changed:', user?.uid);
      })
    );
  }

  // Update user data in localStorage
  private updateUserStorage(user: User | null): void {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Unknown',
        photoURL: user.photoURL || this.getDefaultProfilePic()
      };
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }

  // User registration
  async signUp(email: string, password: string, name: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update Firebase profile
      await updateProfile(user, { 
        displayName: name,
        photoURL: this.getDefaultProfilePic()
      });

      // Create user document in Firestore
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        name: name,
        pfp: this.getDefaultProfilePic(),
        banner: this.getDefaultBanner()
      });

      this.updateUserStorage(user);
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  // User login
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

  // User logout
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.updateUserStorage(null);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Check login status
  isLoggedIn(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    return await firstValueFrom(this.currentUser$);
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    return userData ? JSON.parse(userData).uid : null;
  }

  // Get current user email
  getCurrentUserEmail(): string | null {
    const userData = localStorage.getItem(this.USER_STORAGE_KEY);
    return userData ? JSON.parse(userData).email : null;
  }

  // Debug user storage
  debugAuthState(): void {
    this.currentUser$.subscribe(user => {
      console.log('Current auth state:', user);
      console.log('Local storage:', localStorage.getItem(this.USER_STORAGE_KEY));
    });
  }

  // Helper methods
  private getDefaultProfilePic(): string {
    return 'https://pbs.twimg.com/profile_images/1757203362381168640/j9704gu__400x400.jpg';
  }

  private getDefaultBanner(): string {
    return 'https://pbs.twimg.com/profile_banners/1686901686185721857/1717108459/1500x500';
  }
}