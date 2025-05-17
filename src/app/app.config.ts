import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"twitter-bff47","appId":"1:573750875471:web:fcd763cbd4ce415b4aa13a","storageBucket":"twitter-bff47.firebasestorage.app","apiKey":"AIzaSyAmvRYmthUch5zP0cuyCNpJaNfC_gDKyTY","authDomain":"twitter-bff47.firebaseapp.com","messagingSenderId":"573750875471"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()) // 💡 IDE kerüljön, ne a main.ts-be
  ]
};
