"use client";

import { async } from "@firebase/util";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    //https://firebase.google.com/docs/auth/web/start?hl=ja#web-modular-api
    //メールアドレスに@gmail.comがないとエラーになる。
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCrendential) => {
        const user = userCrendential.user;
        router.push("/auth/login");
      })
      .catch((error) => {
        console.error(error);
        // alert(error);
        if (error.code === "auth/email-already-in-use") {
          alert("このメールアドレスはすでに使用されています。");
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
        <h1 className="mb-4 text-2xl text-gray-700 font-medium">新規登録</h1>

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
            新規登録
          </button>
        </div>
        <div className="mt-4">
          <span className="text-gray-600 text-sm">
            既にアカウントをお持ちですか？
          </span>
          <button
            onClick={() => router.push("/auth/login")}
            className="text-blue-500 hover:text-blue-700 text-sm font-bold ml-1"
          >
            ログインページへ
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
