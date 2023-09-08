import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

type SidebarProps = {
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

const Sidebar = ({ setSelectedRoom }: SidebarProps) => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const roomRef = collection(db, "room");
      const roomSnapshot = await getDocs(roomRef);
      const roomData = roomSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setRooms(roomData);
    };

    fetchRooms();
  }, []);

  const selectRoom = async (roomId: string) => {
    // console.log(roomId);
    setSelectedRoom(roomId);
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5">
      <h1 className="text-2xl font-semibold p-4">New Chat</h1>
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
            className="cursor-pointer border-b p-4 text-slate-100"
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
