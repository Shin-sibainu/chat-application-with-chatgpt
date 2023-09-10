import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

type SidebarProps = {
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

type Room = {
  id: string;
  name: string;
  createdAt: Timestamp;
};

const Sidebar = ({ setSelectedRoom }: SidebarProps) => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      // const roomRef = collection(db, "room");
      // const roomSnapshot = await getDocs(roomRef);
      // const roomData = roomSnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   name: doc.data().name,
      // }));

      // setRooms(roomData);

      const roomCollectionRef = collection(db, "room");
      const q = query(roomCollectionRef, orderBy("createdAt"));
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
      });
    }
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5">
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
  );
};

export default Sidebar;
