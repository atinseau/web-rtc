'use client';

import { webRTCStore } from "@/contexts/WebRTCContext/WebRTCProvider";
import { currentRoomIdAtom, peerConnectionAtom } from "@/contexts/WebRTCContext/atoms";

import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { set } from "firebase/database";

const roomsCollection = collection(db, 'rooms')

const roomOfferCollection = null
const roomAnswerCollection = null

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

  const roomDoc = doc(roomsCollection)

  const offerCandidatesCollection = collection(db, 'rooms', roomDoc.id, 'offerCandiates')
  const answerCandidatesCollection = collection(db, 'rooms', roomDoc.id, 'answerCandidates')

  // generate room id with firestore auto id
  const roomId = roomDoc.id

  peerConnection.onicecandidate = (event) => {
    console.log('icecandidate event: ', event)
    event.candidate && addDoc(offerCandidatesCollection, event.candidate.toJSON())
  }

  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)

  const roomWithOffer: RoomOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp
    }
  }

  await setDoc(roomDoc, roomWithOffer)
  webRTCStore.set(currentRoomIdAtom, roomId)

  // Listen for remote answer
  onSnapshot(roomDoc, async (snapshot) => {
    const data = snapshot.data() as RoomAnswer | RoomOffer
    // check any answer from the other peer
    if (!peerConnection.currentRemoteDescription && 'answer' in data && data.answer) {
      const answerDescription = new RTCSessionDescription(data.answer)
      peerConnection.setRemoteDescription(answerDescription)

      console.log('setRemoteDescription', answerDescription)
    }
  })


  onSnapshot(answerCandidatesCollection, (snapshot) => {

    console.log('answerCandidatesCollection', snapshot)

    snapshot.docChanges().forEach((change) => {

      console.log('answerCandidatesCollection change', change)

      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data())
        peerConnection.addIceCandidate(candidate)
      }
    })
  })

}


async function joinRoom(formData: FormData) {
  const peerConnection = webRTCStore.get(peerConnectionAtom)
  if (!peerConnection) {
    throw new Error('Peer connection is not defined')
  }

  const roomId = formData.get('roomId') as string
  const roomDoc = doc(roomsCollection, roomId)
  const answerCandidatesCollection = collection(db, 'rooms', roomDoc.id, 'answerCandidates')
  const offerCandidatesCollection = collection(db, 'rooms', roomDoc.id, 'offerCandiates')

  peerConnection.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidatesCollection, event.candidate.toJSON())
  }

  const data = (await getDoc(roomDoc)).data() as RoomOffer
  if (!data) {
    throw new Error('Room does not exist')
  }

  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer))

  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)

  const roomAnswer: RoomAnswer = {
    answer: {
      type: answer.type,
      sdp: answer.sdp
    }
  }
  await updateDoc(roomDoc, roomAnswer)
  webRTCStore.set(currentRoomIdAtom, roomId)

  onSnapshot(offerCandidatesCollection, (snapshot) => {

    console.log('offerCandidatesCollection', snapshot)

    snapshot.docChanges().forEach((change) => {
      console.log('offerCandidatesCollection change', change)
      if (change.type === "added") {
        const data = change.doc.data()
        peerConnection.addIceCandidate(new RTCIceCandidate(data))
      }
    })
  })
}


export {
  createRoom,
  joinRoom
}