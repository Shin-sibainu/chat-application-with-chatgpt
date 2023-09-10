"use client";

import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import axios from "axios";
import OpenAI from "openai";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckLoading, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ChatCompletionCreateParams } from "openai/resources/chat/index.mjs";

type ChatProps = {
  selectedRoom: string | null;
};

type Message = {
  text: string;
  sender: string;
  craetedAt: Timestamp;
};

type MyCompletionMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat = ({ selectedRoom }: ChatProps) => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scrollDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  //各Roomにおけるメッセージの取得
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedRoom) {
        const roomDocRef = doc(db, "room", selectedRoom);
        const messagesCollectionRef = collection(roomDocRef, "messages");

        // setMessages(fetchMessages);
        // console.log(fetchMessages);

        const q = query(messagesCollectionRef, orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
          setMessages(newMessages);
        });

        return () => {
          unsubscribe();
        };
      }
    };

    fetchMessages();
  }, [selectedRoom]);

  //メッセージの送信と追加
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      text: inputMessage,
      sender: "user",
      createdAt: serverTimestamp(),
    };

    // メッセージを Firestore に保存
    const roomDocRef = doc(db, "room", selectedRoom!);
    const messagesCollectionRef = collection(roomDocRef, "messages");
    await addDoc(messagesCollectionRef, messageData);

    // 最後のN個の交換を取得（例では最後の5個）
    const lastNMessages: MyCompletionMessage[] = messages
      .slice(-5)
      .map((message) => ({
        role: message.sender === "user" ? "user" : "assistant", // この行を修正
        content: message.text,
      }));

    // 新しいユーザーの入力を追加
    lastNMessages.push({ role: "user", content: inputMessage });

    const prompt = inputMessage; // ここを自分の需要に合わせて調整
    // 入力フィールドをクリア
    setInputMessage("");

    setIsLoading(true);

    const gpt3Response = await openai.chat.completions.create({
      // messages: [{ role: "user", content: prompt }],
      messages: lastNMessages,
      model: "gpt-3.5-turbo",
    });

    setIsLoading(false);

    const botResponse = gpt3Response.choices[0].message.content;
    console.log(botResponse);

    // ボットの返信を Firestore に保存
    await addDoc(messagesCollectionRef, {
      text: botResponse,
      sender: "bot",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="bg-gray-500 h-full p-4 flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Room 1</h1>
      <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.sender === "user" ? "text-right" : "text-left"}
          >
            <div
              className={
                message.sender === "user"
                  ? "bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                  : "bg-green-500 inline-block rounded px-4 py-2 mb-2"
              }
            >
              <p className="text-white">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="fa-2x">
            <FontAwesomeIcon icon={faSpinner} spin className="text-white" />
          </div>
        )}
      </div>
      <div className="flex-shrink-0 relative">
        <input
          type="text"
          placeholder="Send a message"
          className="border-2 rounded w-full p-2 pr-10 focus:outline-none"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
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
