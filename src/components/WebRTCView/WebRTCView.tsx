'use client';

import { currentRoomIdAtom, localStreamAtom, peerConnectionAtom, remoteStreamAtom } from "@/contexts/WebRTCContext/atoms";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "../Button";
import { exitRoom, joinRoom } from "@/utils/WebRTC/room";

import styles from './WebRTCView.module.css'
import { useParams } from "next/navigation";

export default function WebRTCView() {

  const param = useParams()

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const [roomId] = useAtom(currentRoomIdAtom)
  const [localStream] = useAtom(localStreamAtom)
  const [remoteStream] = useAtom(remoteStreamAtom)

  const [peerConnection] = useAtom(peerConnectionAtom)


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

  useEffect(() => {
    const { id } = param
    if (!id || !peerConnection || localStream) return
    joinRoom(null, id as string)
  }, [
    peerConnection,
    param,
    localStream
  ])

  return <div>
    {roomId
      ? <div>
        <h2>Room Id: {roomId}</h2>
        <div className="flex gap-4">
          <div>
            <h3>Local</h3>
            <video
              autoPlay
              playsInline
              className={styles.videoReceiver}
              ref={localVideoRef}
            />
          </div>

          <div>
            <h3>Remote</h3>
            <video
              autoPlay
              playsInline
              className={styles.videoReceiver}
              ref={remoteVideoRef}
            />
          </div>
        </div>
        <Button onClick={exitRoom}>Leave room</Button>
      </div>
      : <h2>Not in a room</h2>
    }
  </div>
}