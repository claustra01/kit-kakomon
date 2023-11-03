import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '@/firebase';

export default function Register() {

  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const inputValidation = () => {
    if (!email.includes('@mail.kyutech.jp')) {
      throw new Error('invalid email');
    }
    if (password.length < 8) {
      throw new Error('password is too short');
    }
  }

  const firebaseRegister = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async () => {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
        router.push('/verify-email');
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
  }

  const signIn = async () => {
    try {
      inputValidation();
      firebaseRegister();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <div>
          <h1>Register</h1>
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
          <button onClick={signIn}>Register</button>
        </div>
      </main>
    </>
  );
}
