import { useState } from 'react';
import { useRouter } from 'next/router';
import { User, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/firebase';

export default function Home() {

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const firebaseLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        await sendEmailVerification(user)
        router.push('/verify-email');
      }
      setFirebaseUser(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
  }

  const checkUser = async () => {
    try {
      const uid = firebaseUser?.uid;
      const response = await fetch(`/api/users?id=${uid}`);
      const data = await response.json();
      if (response.ok) {
        // redirect to home
        router.push(`/home`);
      } else if (response.status === 404) {
        // setup profile
        router.push(`/profile/setup?id=${uid}`);
      } else {
        console.error(response.statusText, data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const signIn = async () => {
    try {
      firebaseLogin();
      if (firebaseUser?.emailVerified) {
        checkUser();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <div>
          <h1>Login</h1>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={signIn}>Login</button>
        </div>
      </main>
    </>
  );
}
