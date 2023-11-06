import { atom } from "jotai";
import type { useRouter } from "next/navigation";

export const peerConnectionAtom = atom<RTCPeerConnection | null>(null)

export const currentRoomIdAtom = atom<string | null>(null)

export const localStreamAtom = atom<MediaStream | null>(null)

export const remoteStreamAtom = atom<MediaStream | null>(null)

export const listModalAtom = atom<boolean>(false)

export const routerAtom = atom<ReturnType<typeof useRouter> | null>(null)