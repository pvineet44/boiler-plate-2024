import React, { useEffect } from "react";
import LoginForm from "@/components/auth/login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session?.user, router]);
  return (
    <div className="bg-yellow-400 dark:bg-gray-800 h-screen overflow-hidden flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
