import { Button } from "@/components/Button";
import ListOfRooms from "@/components/ListOfRooms";
import WebRTCView from "@/components/WebRTCView";
import { createRoom, joinRoom, toggleListModal } from "@/utils/WebRTC/room";

export default function Home() {
  return <div className="w-screen h-screen flex items-center justify-center">
    <div className="w-full max-w-[400px] p-4 flex justify-center items flex-col gap-4">
      <h1 className="text-center">WebRTC connector</h1>
      <Button onClick={createRoom}>Create room</Button>
      <form action={joinRoom} className="flex gap-2">
        <input name="roomId" className="border-2 w-full p-2 rounded-md" placeholder="Enter room ID" />
        <Button className="whitespace-nowrap">Join room</Button>
      </form>
      <Button onClick={toggleListModal}>List of available room</Button>
      <ListOfRooms />
    </div>
  </div>
}
