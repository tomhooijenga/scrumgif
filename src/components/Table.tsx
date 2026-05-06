import { useChannel } from 'ably/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card.tsx';

interface VoteEntry {
  card: string;
  gifUrl?: string;
}

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
    <div className="p-6">
      <h2 className="text-indigo-600 mb-4 text-xl font-bold">
        Votes
      </h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">No votes yet. Waiting for players…</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          <AnimatePresence>
            {entries.map(([clientId, { card, gifUrl }]) => (
              <motion.div
                key={clientId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex flex-col items-center gap-2"
              >
                {/* Card */}
                <Card label={card} gifUrl={gifUrl} revealed={revealed} />
                {/* Player name */}
                <span className="text-xs text-gray-700 font-medium">{clientId}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


