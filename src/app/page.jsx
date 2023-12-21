"use client"
import React from 'react';
import { useEffect} from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {

  const router = useRouter();
  useEffect(() => {
      router.push('/main')
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      </div>
    </main>
  )
}
