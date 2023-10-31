'use client';

import { webRTCStore } from "@/contexts/WebRTCContext/WebRTCProvider";
import { currentRoomIdAtom, peerConnectionAtom } from "@/contexts/WebRTCContext/atoms";
import { addDoc, collection } from "firebase/firestore";
import { initFirestore } from "../Firebase/init";

const db = initFirestore()
const candidates = collection(db, 'candidates')

const offerCandidates = collection(db, "candidates", candidates.id, "offerCandidates")
const answerCandidates = collection(db, "candidates",  candidates.id, "answerCandidates")

type RoomOffer = {
  offer: RTCSessionDescriptionInit
}

type RoomAnswer = {
  answer: RTCSessionDescriptionInit
}

async function createRoom() {
  const peerConnection = webRTCStore.get(peerConnectionAtom)
  if (!peerConnection) {
    throw new Error('Peer connection is not defined')
  }

  peerConnection.onicecandidate = async (event) => {
    console.log('Got ice candidate', event)
  }

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  const roomWithOffer: RoomOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp
    }
  }

  addDoc(offerCandidates, roomWithOffer)

  // webRTCStore.set(currentRoomIdAtom, roomRef.id)
}


async function joinRoom(formData: FormData) {
  const peerConnection = webRTCStore.get(peerConnectionAtom)
  if (!peerConnection) {
    throw new Error('Peer connection is not defined')
  }

  const roomId = formData.get('roomId') as string

  // await peerConnection.setRemoteDescription(room.offer)
  // const answer = await peerConnection.createAnswer()
  // await peerConnection.setLocalDescription(answer)

  // const roomWithAnswer: RoomAnswer = {
  //   answer: {
  //     type: answer.type,
  //     sdp: answer.sdp
  //   }
  // }

}

export {
  createRoom,
  joinRoom
}