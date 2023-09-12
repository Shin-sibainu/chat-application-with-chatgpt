"use client";

import Chat from "@/app/components/Chat";
import Sidebar from "@/app/components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const { selectedRoom, setSelectedRoom } = useAppContext();
  // const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // 他のスタイルやコンポーネントを一度無効にして、この部分だけで確認
    <div className="flex h-screen justify-center items-center">
      <div className="flex h-full" style={{ width: "1280px" }}>
        <div className="flex-none w-1/5 h-full border-r bg-red-200">
          <Sidebar />
        </div>
        <div className="flex-grow w-4/5 h-full bg-blue-200">
          <Chat selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        </div>
      </div>
    </div>
  );
}
