"use client"
import React from 'react';
import { createContext, useContext, useState } from 'react';
import { Inter } from 'next/font/google'
import { FirebaseAppProvider} from 'reactfire';
import './globals.css'
import config from '@/firebase/config';

const inter = Inter({ subsets: ['latin'] });

const UserContext = createContext();
const ActivityContext = createContext();
const EquipoContext = createContext();
const EventoContext = createContext();

export const useActivityContext = () =>{
  return useContext(ActivityContext);
}

export const useUserContext = () =>{
  return useContext(UserContext);
}

export const useEquipoContext = () =>{
  return useContext(EquipoContext);
}

export const useEventoContext = () =>{
  return useContext(EventoContext);
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [eventoEdit, setEventoEdit] = useState(null);
  return (
    <html lang="en">
      <UserContext.Provider value={{user, setUser}}>
      <EventoContext.Provider value={{eventoEdit, setEventoEdit}}>
      <ActivityContext.Provider value={{activity, setActivity}}>
      <EquipoContext.Provider value={{equipo, setEquipo}}>
      <FirebaseAppProvider firebaseConfig={config}>
      <body className={inter.className}>
        {children}
        </body>
      </FirebaseAppProvider>
      </EquipoContext.Provider>
      </ActivityContext.Provider>
      </EventoContext.Provider>
      </UserContext.Provider>
    </html>
  )
}
