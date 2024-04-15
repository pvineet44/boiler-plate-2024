import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";

const FormSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required!")
    .min(8, "Password must have than 8 characters"),
  confimPassword: z
    .string()
    .min(1, "Password is required!")
    .min(8, "Password must have than 8 characters"),
});

const ResetPasswordForm = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confimPassword: "",
    },
  });

  const onFormSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values?.confimPassword !== values?.password) {
      toast("Passwords doesn't matched!", { type: "error" });
      return;
    }
    const ses = sessionStorage.getItem("for-pass");
    const id = JSON.parse(ses as string);
    await axios
      .post("/api/password/reset-password", { id, password: values?.password })
      .then((res) => {
        toast("Password updated successfully. redirecting to login!", {
          type: "success",
          onClose: () => {
            sessionStorage.removeItem("for-pass");
            router.push("/login");
          },
        });
      })
      .catch((err) => {
        toast(err?.response?.data?.description ?? "Something went wrong!", {
          type: "error",
          onClose: () => {
            sessionStorage.removeItem("for-pass");
          },
        });
      });
  };
  return (
    <div className="w-full flex flex-col justify-center items-center gap-y-16">
      <div className=" lg:w-6/12 md:7/12 w-8/12 shadow-3xl rounded-xl">
        <div className="bg-gray-800 shadow shadow-gray-200 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF">
            <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
          </svg>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-12 md:p-24">
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <Lock className="absolute ml-3" />
            <input
              type="password"
              id="password"
              className="bg-gray-200 rounded pl-12 py-2 md:py-4 focus:outline-none w-full"
              placeholder="New Password"
              {...register("password")}
            />
          </div>
          <div className="flex items-center text-lg mb-4 md:mb-6">
            <Lock className="absolute ml-3" />
            <input
              type="password"
              id="confirmPassword"
              className="bg-gray-200 rounded pl-12 py-2 md:py-4 focus:outline-none w-full"
              placeholder="Confirm Password"
              {...register("confimPassword")}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
