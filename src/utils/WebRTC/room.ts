'use client';

import { webRTCStore } from "@/contexts/WebRTCContext/WebRTCProvider";
import { currentRoomIdAtom, listModalAtom, localStreamAtom, peerConnectionAtom, remoteStreamAtom, routerAtom } from "@/contexts/WebRTCContext/atoms";

import { db } from "../firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";


export const roomsCollection = collection(db, 'rooms')

type RoomOffer = {
  offer: RTCSessionDescriptionInit
}

type RoomAnswer = {
  answer: RTCSessionDescriptionInit
}

const generateStream = async () => {

  let stream: MediaStream | null = null


  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
  } catch (error) {
    console.error('Error accessing media devices.', error)
  }

  if (stream) {
    return stream
  }

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    })
  } catch (e) {
    console.error('Error accessing media devices.', e)
  }

  return stream
}

async function createRoom() {
  const peerConnection = webRTCStore.get(peerConnectionAtom)
  if (!peerConnection) {
    throw new Error('Peer connection is not defined')
  }

  const localStream = await generateStream()

  if (!localStream) {
    throw new Error('Local stream is not defined')
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })
  webRTCStore.set(localStreamAtom, localStream)


  const remoteStream = new MediaStream()
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream?.addTrack(track)
    })
  }
  webRTCStore.set(remoteStreamAtom, remoteStream)




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
  webRTCStore.get(routerAtom)?.push('/rooms/' + roomId)

  // Listen for remote answer
  onSnapshot(roomDoc, async (snapshot) => {
    const data = snapshot.data() as RoomAnswer | RoomOffer
    // check any answer from the other peer
    if (!peerConnection.currentRemoteDescription && 'answer' in data && data.answer) {
      const answerDescription = new RTCSessionDescription(data.answer)
      peerConnection.setRemoteDescription(answerDescription)
    }
  })


  onSnapshot(answerCandidatesCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("Getting candidates from remote peer", change.doc.data())
        const candidate = new RTCIceCandidate(change.doc.data())
        peerConnection.addIceCandidate(candidate)
      }
    })
  })

}


async function joinRoom(formData: FormData | null, room?: string) {
  const peerConnection = webRTCStore.get(peerConnectionAtom)
  if (!peerConnection) {
    throw new Error('Peer connection is not defined')
  }

  
  const roomId = formData ? formData.get('roomId') as string : room
  if (!roomId || !roomId.length) {
    throw new Error('Room id is not defined')
  }

  const localStream = await generateStream()

  if (!localStream) {
    throw new Error('Local stream is not defined')
  }

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream)
  })
  webRTCStore.set(localStreamAtom, localStream)



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

  const remoteStream = new MediaStream()

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      console.log('set track to remote stream', track)
      remoteStream.addTrack(track)
    })
  }

  webRTCStore.set(remoteStreamAtom, remoteStream)

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
  webRTCStore.get(routerAtom)?.push('/rooms/' + roomId)


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


async function exitRoom() {
  webRTCStore.set(currentRoomIdAtom, null)
  webRTCStore.get(routerAtom)?.push('/')
}

async function toggleListModal() {
  webRTCStore.set(listModalAtom, !webRTCStore.get(listModalAtom))
}

export {
  createRoom,
  joinRoom,
  exitRoom,
  toggleListModal
}