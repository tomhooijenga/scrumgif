import {ChannelProvider, useChannel} from "ably/react";
import {useParams} from "react-router";
import {CardPicker, GifPicker, type KlipyGif, CARDS} from "./Deck.tsx";
import {Table} from "./Table.tsx";
import {useState} from "react";

function RoomInner() {
  const params = useParams();
  const [selectedCard, setSelectedCard] = useState<(typeof CARDS)[number] | undefined>();
  const [selectedGif, setSelectedGif] = useState<KlipyGif | undefined>();

  const channel = useChannel(params.room);

  useChannel(params.room, 'reset', () => {
    setSelectedCard(undefined);
    setSelectedGif(undefined);
  });

  const buttonStyle = {
    padding: '10px 28px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  };

  return (
    <div className="flex flex-col" style={{height: '100vh'}}>
      <div style={{ display: 'flex', gap: '12px', margin: '0 24px 16px' }}>
        <button
          onClick={() => channel.publish('reveal', null)}
          style={{ ...buttonStyle, background: '#4f46e5', boxShadow: '0px 4px 12px rgba(79,70,229,0.4)' }}
        >
          Reveal cards
        </button>
        <button
          onClick={() => channel.publish('reset', null)}
          style={{ ...buttonStyle, background: '#6b7280', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)' }}
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
          channel.publish('vote', { card: String(selectedCard), gifUrl: gif.url });
        }}
      />

      <Table room={params.room} />
    </div>
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