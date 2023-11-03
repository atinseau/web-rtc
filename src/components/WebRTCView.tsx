'use client';

import { currentRoomIdAtom, peerConnectionAtom } from "@/contexts/WebRTCContext/atoms";
import { useAtom } from "jotai";
import { useRef } from "react";

export default function WebRTCView() {

  const videoRef = useRef<HTMLVideoElement>(null)

  const [roomId] = useAtom(currentRoomIdAtom)
  const [peerConnection] = useAtom(peerConnectionAtom)

  return <div>
    {roomId
      ? <div>
        <h2>Room Id: {roomId}</h2>
        <video autoPlay playsInline ref={videoRef} />
      </div>
      : <h2>Not in a room</h2>
    }
  </div>
}