import {ChannelProvider, useChannel} from "ably/react";
import {useParams} from "react-router";
import {Deck} from "./Deck.tsx";
import {PresenceStatus} from "./PresenceStatus.tsx";
import {Table} from "./Table.tsx";
import {useState} from "react";

function RoomInner() {
  const params = useParams();
  const [deckKey, setDeckKey] = useState(0);

  const channel = useChannel(params.room);

  useChannel(params.room, 'reset', () => {
    setDeckKey(k => k + 1);
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
    <>
      <PresenceStatus room={params.room} />
      <Table room={params.room} />
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
      <Deck key={deckKey} onSelectCard={(card, gifUrl) => channel.publish('vote', { card, gifUrl })} />
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