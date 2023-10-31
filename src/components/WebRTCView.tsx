'use client';

import { currentRoomIdAtom, peerConnectionAtom } from "@/contexts/WebRTCContext/atoms";
import { useAtom } from "jotai";

export default function WebRTCView() {

  const [roomId] = useAtom(currentRoomIdAtom)

  return <div>
    {roomId
      ? <h2>Room Id: {roomId}</h2>
      : <h2>Not in a room</h2>
    }
  </div>
}