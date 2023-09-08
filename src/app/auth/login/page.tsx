"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { auth } from "../../../../firebase";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCrendential) => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        // alert(error);
        if (error.code === "auth/user-not-found") {
          alert("そのようなユーザーは存在しません。");
        } else {
          alert(error.message); // その他のエラーメッセージを表示
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">ログイン</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            {...register("email", {
              required: "メールアドレスは必須です。",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "不適切なメールアドレスです。",
              },
            })}
            className="mt-1 p-2 w-full border-2 rounded-md"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "パスワードは必須です。",
              minLength: {
                value: 6,
                message: "6文字以上入力してください。",
              },
            })}
            className="mt-1 p-2 w-full border-2 rounded-md"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
