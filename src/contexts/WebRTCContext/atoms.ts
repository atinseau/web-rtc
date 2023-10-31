import { atom } from "jotai";

export const peerConnectionAtom = atom<RTCPeerConnection | null>(null)

export const currentRoomIdAtom = atom<string | null>(null)