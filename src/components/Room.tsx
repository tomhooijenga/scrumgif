import {ChannelProvider, useChannel, usePresence} from "ably/react";
import {Navigate, useParams} from "react-router";
import {Table} from "./Table.tsx";
import {useState} from "react";
import {GifPicker} from "./GifPicker.tsx";
import {CardPicker} from "./CardPicker.tsx";
import type {Card} from "../types/Card.ts";
import type {KlipyGif} from "../types/KlipyResponse.ts";
import {AnimatePresence, LayoutGroup} from "motion/react";

function RoomInner() {
  const {room = ''} = useParams();
  const [selectedCard, setSelectedCard] = useState<Card | undefined>();
  const [selectedGif, setSelectedGif] = useState<KlipyGif | undefined>();
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [fetchKey, setFetchKey] = useState(0);

  const channel = useChannel(room);

  useChannel(room, 'reset', () => {
    setSelectedCard(undefined);
    setSelectedGif(undefined);
    setShowGifPicker(false);
  });

  usePresence(room, {name: localStorage.name});

  function selectCard(card: Card) {
    setSelectedCard(card);
    setSelectedGif(undefined);
    setShowGifPicker(true);
    setFetchKey(k => k + 1);
  }

  function selectGif(gif: KlipyGif) {
    setSelectedGif(gif);
    setShowGifPicker(false);
    channel.publish('vote', {
      card: selectedCard,
      gif: gif.file.sm.gif
    });
  }

  return (
    <div className="flex flex-col h-screen p-6">
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
        className={'container mx-auto'}
        selectedCard={selectedCard}
        onSelectCard={selectCard}
      />

      <LayoutGroup>
        <AnimatePresence>
          {showGifPicker && <GifPicker
              card={selectedCard}
              fetchKey={fetchKey}
              selectedGif={selectedGif}
              onSelectGif={selectGif}
          />}
        </AnimatePresence>
        <Table room={room}/>
      </LayoutGroup>
    </div>
  )
}

export function Room() {
  const {room = ''} = useParams();

  if (!localStorage.getItem("name")) {
    return <Navigate to={`/name?redirect=/room/${room}`} replace/>;
  }

  return (
    <ChannelProvider channelName={room}>
      <RoomInner/>
    </ChannelProvider>
  )
}