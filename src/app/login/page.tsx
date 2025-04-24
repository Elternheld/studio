"use client";

import { useEffect, useState } from "react";
import {
  getRedirectResult,
  signInWithRedirect,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, provider } from "@/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // 1. Prüfe nach Redirect, ob ein User vorhanden ist
  useEffect(() => {
    const checkAuth = async () => {
      const result = await getRedirectResult(auth);
      const firebaseUser = result?.user || auth.currentUser;

      if (firebaseUser) {
        setUser(firebaseUser);
        router.push("/dashboard");
      }
    };

    checkAuth();

    // 2. Live-Überwachung, falls bereits eingeloggt
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // 🔐 Login per Google Redirect
  const loginWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("❌ Fehler beim Login:", error);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-4">Willkommen bei ElternHeld</h1>
      <p className="text-lg text-gray-600 mb-8">
        Bitte melde dich an, um fortzufahren
      </p>

      <button
        onClick={loginWithGoogle}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl shadow-md transition-all"
      >
        Mit Google anmelden
      </button>

      {user && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Angemeldet als:</p>
          <p className="font-medium">{user.displayName}</p>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Abmelden
          </button>
        </div>
      )}
    </main>
  );
}
