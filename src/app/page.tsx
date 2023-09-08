"use client";

import Chat from "@/app/components/Chat";
import Sidebar from "@/app/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    // 他のスタイルやコンポーネントを一度無効にして、この部分だけで確認
    <div className="flex h-screen justify-center items-center">
      <div className="flex h-full" style={{ width: "1280px" }}>
        <div className="flex-none w-1/5 h-full border-r bg-red-200">
          <Sidebar setSelectedRoom={setSelectedRoom} />
        </div>
        <div className="flex-grow w-4/5 h-full bg-blue-200">
          <Chat selectedRoom={selectedRoom} />
        </div>
      </div>
    </div>
  );
}
