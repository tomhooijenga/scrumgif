import { useChannel } from 'ably/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface VoteEntry {
  card: string;
  gifUrl?: string;
}

const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Adwaita Sans, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif';

export function Table({ room }: { room: string }) {
  const [votes, setVotes] = useState<Record<string, VoteEntry>>({});
  const [revealed, setRevealed] = useState(false);

  useChannel(room, 'vote', (message) => {
    const clientId = message.clientId ?? 'Unknown';
    const { card, gifUrl } = message.data as { card: string; gifUrl?: string };
    setVotes(prev => ({ ...prev, [clientId]: { card, gifUrl } }));
  });

  useChannel(room, 'reveal', () => {
    setRevealed(true);
  });

  useChannel(room, 'reset', () => {
    setVotes({});
    setRevealed(false);
  });

  const entries = Object.entries(votes) as [string, VoteEntry][];

  return (
    <div style={{ padding: '24px', fontFamily: SYSTEM_FONT }}>
      <h2 style={{ color: '#4f46e5', marginBottom: '16px', fontSize: '1.25rem', fontWeight: 'bold' }}>
        Votes
      </h2>
      {entries.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No votes yet. Waiting for players…</p>
      ) : (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <AnimatePresence>
            {entries.map(([clientId, { card, gifUrl }]) => (
              <motion.div
                key={clientId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                {/* Card */}
                <div
                  style={{
                    aspectRatio: '2.5/3.5',
                    height: '120px',
                    borderRadius: '10px',
                    border: '2px solid #4f46e5',
                    boxShadow: '0px 0px 20px rgba(79,70,229,0.4), 3px 3px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: revealed && isNaN(Number(card)) ? '1rem' : '2rem',
                    fontWeight: 'bold',
                    color: revealed ? '#4f46e5' : '#a5b4fc',
                    background: revealed ? (gifUrl ? 'transparent' : '#eef2ff') : (!gifUrl ? '#4f46e5' : 'transparent'),
                    overflow: 'hidden',
                    position: 'relative',
                    userSelect: 'none',
                  }}
                >
                  {revealed ? (
                    <>
                      {gifUrl && (
                        <img
                          src={gifUrl}
                          alt={card}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                      <span style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.6rem', color: gifUrl ? 'white' : '#a5b4fc', textShadow: gifUrl ? '0 1px 3px rgba(0,0,0,0.8)' : undefined }}>{card}</span>
                      <span style={{ position: 'relative', zIndex: 1, fontSize: isNaN(Number(card)) ? '1rem' : '2rem', color: gifUrl ? 'white' : '#4f46e5', textShadow: gifUrl ? '0 2px 6px rgba(0,0,0,0.7)' : undefined }}>{card}</span>
                      <span style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.6rem', color: gifUrl ? 'white' : '#a5b4fc', textShadow: gifUrl ? '0 1px 3px rgba(0,0,0,0.8)' : undefined, transform: 'rotate(180deg)' }}>{card}</span>
                    </>
                  ) : gifUrl ? (
                    <img
                      src={gifUrl}
                      alt={card}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', filter: 'blur(8px)', transform: 'scale(1.1)' }}
                    />
                  ) : (
                    <span style={{ fontSize: '2rem', color: '#818cf8' }}>🂠</span>
                  )}
                </div>
                {/* Player name */}
                <span style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 500 }}>{clientId}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


