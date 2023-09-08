import React from "react";

type SidebarProps = {
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

const Sidebar = ({ setSelectedRoom }: SidebarProps) => {
  const handleRoomClick = async (room: string) => {
    setSelectedRoom(room);
  };

  return (
    <div className="bg-custom-blue h-full overflow-y-auto px-5">
      <h1 className="text-2xl font-semibold p-4">New Chat</h1>
      <ul>
        <li
          onClick={() => handleRoomClick("Room 1")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 1
        </li>
        <li
          onClick={() => handleRoomClick("Room 2")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 2
        </li>
        <li
          onClick={() => handleRoomClick("Room 3")}
          className="cursor-pointer border-b p-4 text-slate-100"
        >
          Room 3
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
