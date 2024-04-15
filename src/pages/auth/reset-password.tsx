import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ResetPasswordForm from "@/components/auth/resetPassword";

const ResetPassword = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session?.user, router]);
  return (
    <div className="bg-yellow-400 dark:bg-gray-800 h-screen overflow-hidden flex items-center justify-center">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
