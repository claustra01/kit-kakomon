import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from "firebase/auth";
import { auth } from '@/firebase';
import { MenuItem, Select } from '@mui/material';
import { Department } from '@/libs/types';

export default function ProfileSetup() {

  const router = useRouter();
  const [entranceYear, setEntranceYear] = useState<string>();
  const [department, setDepartment] = useState<Department>(Department.COMPUTER_SCIENCE_1);
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
          department: Department[department].toString(),
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
            <Select
              id="entrance-year-select"
              value={entranceYear}
              label="EntranceYear"
              onChange={(e) => setEntranceYear(e.target.value)}
            >
              {Array.from({ length: 40 }, (_, index) => (
                <MenuItem key={index} value={(2011 + index).toString()}>{2011 + index}</MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <Select
              id="department-select"
              value={department}
              label="Department"
              onChange={(e) => setDepartment(e.target.value as Department)}
            >
              <MenuItem value={Department.COMPUTER_SCIENCE_1}>情工1類</MenuItem>
              <MenuItem value={Department.COMPUTER_SCIENCE_2}>情工2類</MenuItem>
              <MenuItem value={Department.COMPUTER_SCIENCE_3}>情工3類</MenuItem>
              <MenuItem value={Department.ARTIFICIAL_INTELLIGENCE}>知能情報工学科</MenuItem>
              <MenuItem value={Department.COMPUTER_SCIENCE_AND_NETWORKS}>情報通信工学科</MenuItem>
              <MenuItem value={Department.INTELLIGENT_SYSTEMS}>知的システム工学科</MenuItem>
              <MenuItem value={Department.PHYSICS_INFORMATION}>物理情報工学科</MenuItem>
              <MenuItem value={Department.BIOINFORMATICS}>生命化学情報工学科</MenuItem>
            </Select>
          </div>
          <button onClick={createUser}>Register</button>
        </div>
      </main>
    </>
  );
}