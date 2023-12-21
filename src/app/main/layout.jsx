"use client"
import React from 'react';

import { Inter } from 'next/font/google'
import {AuthProvider, useFirebaseApp, useFirestore, FirestoreProvider } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  const app = useFirebaseApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
  return (
      <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        {children}
        </FirestoreProvider>
      </AuthProvider>
  )
}