'use client';

import { Provider, createStore } from "jotai"
import { peerConnectionAtom } from "./atoms";
import { useEffect } from "react";

type WebRTCProviderProps = {
  children: React.ReactNode
}

export const webRTCStore = createStore()

export default function WebRTCProvider({ children }: WebRTCProviderProps) {

  useEffect(() => {
    if (!webRTCStore.get(peerConnectionAtom)) {
      webRTCStore.set(peerConnectionAtom, new RTCPeerConnection())
    }

    return () => {
      webRTCStore.set(peerConnectionAtom, null)
    }
  }, [])

  return <Provider store={webRTCStore}>
    {children}
  </Provider>
}