import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "firebase/auth";
import { auth } from "@/firebase";


export default function Management() {

  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [invitationList, setInvitationList] = useState([]);

  const getInvitationList = async () => {
    try {
      const response = await fetch('/api/invitations');
      const data = await response.json();
      if (response.ok) {
        setInvitationList(data);
      } else {
        console.error(response.statusText, data.message);
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/`);
    }
  }

  const renderPage = async () => {
    getInvitationList();
    console.log(invitationList);
  }

  const checkUserRole = async () => {
    try {
      const uid = firebaseUser?.uid;
      const response = await fetch(`/api/users?id=${uid}`);
      const data = await response.json();
      if (response.ok) {
        const role = data.role;
        if (role != 'ADMIN') {
          console.error('User role permission denied');
          router.push('/');
        }
        renderPage();
      } else {
        console.error(response.statusText, data.message);
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
      router.push(`/`);
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

  useEffect(() => {
    if (firebaseUser) {
      checkUserRole();
    }
  }, [firebaseUser])

  return (
    <>
      <h1>management</h1>
    </>
  );
}