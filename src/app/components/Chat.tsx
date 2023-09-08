"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import axios from "axios";

type ChatProps = {
  selectedRoom: string | null;
};

type Message = {
  text: string;
  sender: string;
};

const Chat = ({ selectedRoom }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  //各Roomにおけるメッセージの取得
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedRoom) {
        const roomDocRef = doc(db, "room", selectedRoom);
        const messagesCollectionRef = collection(roomDocRef, "messages");
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        const fetchMessages = messagesSnapshot.docs.map(
          (doc) => doc.data() as Message //データの形状を変更する
        );

        setMessages(fetchMessages);

        // console.log(fetchMessages);
      }
    };

    fetchMessages();
  }, [selectedRoom]);

  //メッセージの送信と追加
  const sendMessage = async () => {
    console.log("send");
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
    };

    // メッセージを Firestore に保存
    const roomDocRef = doc(db, "room", selectedRoom!);
    const messagesCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messagesCollectionRef, messageData);

    console.log(messageData);
    console.log(messagesCollectionRef);

    // GPT-3.5 API を呼び出す（例）
    const apiUrl =
      "https://api.openai.com/v1/engines/davinci-codex/completions";
    const prompt = inputMessage; // ここを自分の需要に合わせて調整
    const gpt3Response = await axios.post(
      apiUrl,
      {
        prompt,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
      }
    );

    const botResponse = gpt3Response.data.choices[0].text.trim();

    // ボットの返信を Firestore に保存
    await addDoc(messagesCollectionRef, {
      text: botResponse,
      sender: "bot",
    });

    console.log(botResponse);

    // 入力フィールドをクリア
    setInputMessage("");
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Room 1</h1>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`${
                message.sender === "user" ? "bg-blue-500" : "bg-green-500"
              } inline-block rounded px-4 py-2 mb-2`}
            >
              <p className="text-white">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a message"
          className="border-2 rounded w-full p-2 pr-10 focus:outline-none"
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-2 flex items-center"
          onClick={() => sendMessage()}
        >
          <i className="fa fa-paper-plane text-gray-500 mr-2"></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
