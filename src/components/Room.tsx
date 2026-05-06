import {ChannelProvider, useChannel} from "ably/react";
import {useParams} from "react-router";
import {Deck} from "./Deck.tsx";
import {PresenceStatus} from "./PresenceStatus.tsx";
import {Table} from "./Table.tsx";

function RoomInner() {
  const params = useParams();

  const channel = useChannel(params.room);

  return (
    <>
      <PresenceStatus room={params.room} />
      <Table room={params.room} />
      <Deck onSelectCard={(card, gifUrl) => channel.publish('vote', { card, gifUrl })} />
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