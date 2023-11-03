import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from "firebase/auth";
import { auth } from '@/firebase';

export default function ProfileSetup() {

  const router = useRouter();
  const [entranceYear, setEntranceYear] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  const createUser = async () => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: firebaseUser?.uid,
          email: firebaseUser?.email,
          entrance_year: entranceYear,
          department: department,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // redirect to home
        router.push(`/home`);
      } else {
        console.error(response.statusText, data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });
  });

  return (
    <>
      <main>
        <div>
          <h1>Profile Setup</h1>
          <div>
            <label>EntranceYear:</label>
            <input
              type="text"
              value={entranceYear}
              onChange={(e) => setEntranceYear(e.target.value)}
            />
          </div>
          <div>
            <label>Department:</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <button onClick={createUser}>Register</button>
        </div>
      </main>
    </>
  );
}