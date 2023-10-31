

type RoomByIdProps = {
  params: {
    roomId: string
  }
}

export default async function RoomById({ params }: RoomByIdProps) {

  const { roomId } = params

  return <p>{roomId}</p>
}