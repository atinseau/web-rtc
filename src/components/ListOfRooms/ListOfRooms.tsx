'use client';

import { listModalAtom } from "@/contexts/WebRTCContext/atoms"
import { useAtom } from "jotai"

import styles from './ListOfRooms.module.css'
import { Button } from "../Button";
import { useEffect, useState } from "react";
import { joinRoom, roomsCollection } from "@/utils/WebRTC/room";
import { getDocs } from "firebase/firestore";
import Link from "next/link";

const ListOfRooms = () => {

  const [isOpen, setOpen] = useAtom(listModalAtom)

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    getDocs(roomsCollection).then((snapshot) => {
      const roomJson = snapshot.docs.map((doc) => doc.id)
      console.log(roomJson)
      setRooms(roomJson as [])
    })
  }, [])

  return isOpen &&
    <dialog open className={styles.listOfRooms}>
      <div className="bg-white rounded-md p-4">
        <ul className="mb-4 flex gap-2 flex-col">
          {rooms.map((room) => <li key={room}>
            <button onClick={() => joinRoom(null, room)} className="flex gap-2 items-center">
              <span className="hover:underline">Join this room</span>
              <span className="text-sm text-gray-400">{room}</span>
            </button>
          </li>)}
        </ul>
        <Button onClick={() => setOpen(false)}>close modal</Button>
      </div>
    </dialog>
}

export default ListOfRooms