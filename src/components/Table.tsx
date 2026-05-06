import { useChannel, usePresenceListener } from 'ably/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card.tsx';
import type * as Ably from 'ably';

interface VoteEntry {
  card: string;
  gifUrl?: string;
}

function applyHistoryMessage(
  message: Ably.Message,
  votes: Record<string, VoteEntry>,
  revealed: boolean,
): { votes: Record<string, VoteEntry>; revealed: boolean } {
  if (message.name === 'vote') {
    const clientId = message.clientId ?? 'Unknown';
    const { card, gifUrl } = message.data as { card: string; gifUrl?: string };
    return { votes: { ...votes, [clientId]: { card, gifUrl } }, revealed };
  }
  if (message.name === 'reveal') return { votes, revealed: true };
  if (message.name === 'reset') return { votes: {}, revealed: false };
  return { votes, revealed };
}

export function Table({ room }: { room: string }) {
  const [votes, setVotes] = useState<Record<string, VoteEntry>>({});
  const [revealed, setRevealed] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const { presenceData } = usePresenceListener(room);
  const nameMap = Object.fromEntries(
    presenceData.map(m => [m.clientId, m.data?.status as string | undefined])
  );

  const { channel } = useChannel(room, 'vote', (message) => {
    if (!historyLoaded) return; // history replay will handle this
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

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      // Fetch up to 100 recent messages across all event names
      const page = await channel.history({ limit: 100 });
      if (cancelled) return;

      // History is newest-first; reverse to replay in chronological order
      const messages = [...page.items].reverse();
      let v: Record<string, VoteEntry> = {};
      let r = false;
      for (const msg of messages) {
        ({ votes: v, revealed: r } = applyHistoryMessage(msg, v, r));
      }
      setVotes(v);
      setRevealed(r);
      setHistoryLoaded(true);
    }
    loadHistory();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Card label={card} gifUrl={gifUrl} revealed={revealed} />
                <span className="text-xs text-gray-700 font-medium">{nameMap[clientId]}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


