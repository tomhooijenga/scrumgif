import {ChannelProvider, useChannel} from "ably/react";
import {useParams} from "react-router";
import {Deck} from "./Deck.tsx";
import {PresenceStatus} from "./PresenceStatus.tsx";


function RoomInner() {
  const params = useParams();

  const channel = useChannel(params.room, (message) => {
    console.log(message);
  });

  return (
    <>
      <PresenceStatus room={params.room} />
      <Deck onSelectCard={card => channel.publish('vote', (card))} />
    </>
  )
}

export function Room() {
  const params = useParams();

  return (
    <ChannelProvider channelName={params.room}>
      <RoomInner />
    </ChannelProvider>
  )
}