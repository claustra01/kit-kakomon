import { useRouter } from "next/router";

export default function VerifyEmail() {

  const router = useRouter();
  const redirectToHome = () => {
    router.push('/');
  }

  return (
    <>
      <h1>check your email</h1>
      <button onClick={redirectToHome}>Go to Home</button>
    </>
  );
}