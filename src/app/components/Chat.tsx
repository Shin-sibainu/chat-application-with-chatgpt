"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";

type ChatProps = {
  selectedRoom: string | null;
};

type Message = {
  text: string;
  sender: string;
};

const Chat = ({ selectedRoom }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (selectedRoom) {
      // const colRef = collection(db, "room", "Room1", "messages");
      const roomRef = collection(db, "room");
      console.log(roomRef);
    }
  }, [selectedRoom]);

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Room 1</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        <p>User1: Hello</p>
        <p>User2: Hi</p>
      </div>
      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a message"
          className="border-2 rounded w-full p-2 pr-10 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-2 flex items-center"
        >
          <i className="fa fa-paper-plane text-gray-500 mr-2"></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
