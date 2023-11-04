import { atom } from "jotai";

export const peerConnectionAtom = atom<RTCPeerConnection | null>(null)

export const currentRoomIdAtom = atom<string | null>(null)

export const localStreamAtom = atom<MediaStream | null>(null)

export const remoteStreamAtom = atom<MediaStream | null>(null)