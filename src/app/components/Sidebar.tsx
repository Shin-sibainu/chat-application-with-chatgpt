import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAppContext } from "@/context/AppContext";

type SidebarProps = {
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = () => {
  const { user, userId, setSelectedRoom } = useAppContext();
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // const user = auth.currentUser;
  // const userId = user ? user.uid : null;
  // console.log(userId);

  useEffect(() => {
    if (userId) {
      // userId が存在する場合のみクエリを実行
      const fetchRooms = async () => {
        const roomCollectionRef = collection(db, "room");
        const q = query(
          roomCollectionRef,
          where("userId", "==", userId),
          orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newRooms = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Room)
          );
          setRooms(newRooms);
        });

        return () => {
          unsubscribe();
        };
      };

      fetchRooms();
    }
  }, [userId]); // userId が更新されたときにこの useEffect が再実行される

  useEffect(() => {
    //ユーザーの取得
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const selectRoom = async (roomId: string) => {
    // console.log(roomId);
    setSelectedRoom(roomId);
  };

  const addNewRoom = async () => {
    const roomName = prompt("Enter room name:");
    if (roomName) {
      const newRoomRef = collection(db, "room");
      await addDoc(newRoomRef, {
        name: roomName,
        createdAt: serverTimestamp(),
        userId: userId,
      });
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5 flex flex-col">
      <div className="flex-grow">
        <div
          onClick={addNewRoom}
          className="cursor-pointer flex justify-evenly items-center border mt-2 rounded-md hover:bg-blue-800 duration-150"
        >
          <span className="p-4 text-2xl text-white">+</span>
          <h1 className="text-xl font-semibold p-4">New Chat</h1>
        </div>
        <ul>
          {/* <li
          onClick={() => handleRoomClick("Room1")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 1
        </li>
        <li
          onClick={() => handleRoomClick("Room2")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 2
        </li>
        <li
          onClick={() => handleRoomClick("Room3")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 3
        </li> */}
          {rooms.map((room) => (
            <li
              key={room.id}
              className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-700 duration-150"
              onClick={() => selectRoom(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      {userEmail && (
        <div className="fa-x mb-2 p-4 text-slate-100 text-lg font-medium">{`${userEmail}`}</div>
      )}
      <div
        onClick={handleLogout}
        className="fa-x mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150"
      >
        <i className="fa fa-sign-out mr-2"></i>
        <span className="text-base">ログアウト</span>
      </div>
    </div>
  );
};

export default Sidebar;
