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
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        sendEmailVerification(user)
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

  const createUser = async () => {
    
  }

  const signIn = async () => {
    try {
      firebaseLogin();
      createUser();
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
