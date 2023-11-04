'use client';

import { currentRoomIdAtom, localStreamAtom, peerConnectionAtom, remoteStreamAtom } from "@/contexts/WebRTCContext/atoms";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "./Button";
import { exitRoom } from "@/utils/WebRTC/room";

export default function WebRTCView() {

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [roomId] = useAtom(currentRoomIdAtom)
  const [localStream] = useAtom(localStreamAtom)
  const [remoteStream] = useAtom(remoteStreamAtom)


  useEffect(() => {
    if (!roomId) return
    if (localStream) {
      console.log('localStream')
      localVideoRef.current!.srcObject = localStream
    }
    if (remoteStream) {
      console.log('got a remote stream')
      remoteVideoRef.current!.srcObject = remoteStream
    }
  }, [
    roomId,
    localStream,
    remoteStream
  ])

  return <div>
    {roomId
      ? <div>
        <h2>Room Id: {roomId}</h2>
        <div>
          <h3>Local</h3>
          <video autoPlay playsInline ref={localVideoRef} />
        </div>

        <div>
          <h3>Remote</h3>
          <video autoPlay playsInline ref={remoteVideoRef} />
        </div>
        <Button onClick={exitRoom}>Leave room</Button>
      </div>
      : <h2>Not in a room</h2>
    }
  </div>
}