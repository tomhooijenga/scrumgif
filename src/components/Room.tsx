import {ChannelProvider, useChannel, usePresence} from "ably/react";
import {Navigate, useParams} from "react-router";
import {Table} from "./Table.tsx";
import {useState} from "react";
import {CARDS, GifPicker, type KlipyGif} from "./GifPicker.tsx";
import {CardPicker} from "./CardPicker.tsx";

function RoomInner() {
  const params = useParams();
  const [selectedCard, setSelectedCard] = useState<(typeof CARDS)[number] | undefined>();
  const [selectedGif, setSelectedGif] = useState<KlipyGif | undefined>();

  const channel = useChannel(params.room);

  useChannel(params.room, 'reset', () => {
    setSelectedCard(undefined);
    setSelectedGif(undefined);
  });

  usePresence(params.room, {status: localStorage.name});

  return (
    <div className="flex flex-col h-screen">
      <div className="flex gap-3 mx-6 mb-4">
        <button
          onClick={() => channel.publish('reveal', null)}
          className="px-7 py-2.5 text-white bg-indigo-600 rounded-lg text-base font-bold cursor-pointer border-none [box-shadow:0px_4px_12px_rgba(79,70,229,0.4)]"
        >
          Reveal cards
        </button>
        <button
          onClick={() => channel.publish('reset', null)}
          className="px-7 py-2.5 text-white bg-gray-500 rounded-lg text-base font-bold cursor-pointer border-none [box-shadow:0px_4px_12px_rgba(0,0,0,0.2)]"
        >
          Reset
        </button>
      </div>

      <CardPicker
        selectedCard={selectedCard}
        onSelectCard={(card) => {
          setSelectedCard(card);
          setSelectedGif(undefined);
        }}
      />

      <GifPicker
        card={selectedCard}
        selectedGif={selectedGif}
        onSelectGif={(gif) => {
          setSelectedGif(gif);
          channel.publish('vote', {card: String(selectedCard), gifUrl: gif.url});
        }}
      />

      <Table room={params.room}/>
    </div>
  )
}

export function Room() {
  const params = useParams();

  if (!localStorage.getItem("playerName")) {
    return <Navigate to={`/name?redirect=/room/${params.room}`} replace/>;
  }

  return (
    <ChannelProvider channelName={params.room}>
      <RoomInner/>
    </ChannelProvider>
  )
}