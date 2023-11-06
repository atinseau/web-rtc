'use client';

import { Provider, createStore } from "jotai"
import { peerConnectionAtom, routerAtom } from "./atoms";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type WebRTCProviderProps = {
  children: React.ReactNode
}

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
  ],
  iceCandidatePoolSize: 10
}

export const webRTCStore = createStore()

export default function WebRTCProvider({ children }: WebRTCProviderProps) {

  const router = useRouter()

  useEffect(() => {
    if (!webRTCStore.get(peerConnectionAtom)) {
      const peerConnection = new RTCPeerConnection(servers)
      webRTCStore.set(peerConnectionAtom, peerConnection)
    }

    return () => {
      webRTCStore.set(peerConnectionAtom, null)
    }
  }, [])

  useEffect(() => {
    webRTCStore.set(routerAtom, router)
  }, [router])

  return <Provider store={webRTCStore}>
    {children}
  </Provider>
}