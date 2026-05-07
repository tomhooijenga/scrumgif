import {useChannel, usePresenceListener} from 'ably/react';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Card} from './Card.tsx';
import type * as Ably from 'ably';
import type {Card as CardType} from "../types/Card.ts";
import type {KlipyFile} from "../types/KlipyResponse.ts";
import {CardPlaceholder} from "./CardPlaceholder.tsx";

interface VoteEntry {
  card: CardType;
  gif: KlipyFile
}

function applyHistoryMessage(
  message: Ably.Message,
  votes: Record<string, VoteEntry>,
  revealed: boolean,
): { votes: Record<string, VoteEntry>; revealed: boolean } {
  if (message.name === 'vote') {
    const clientId = message.clientId ?? 'Unknown';
    return {votes: {...votes, [clientId]: message.data}, revealed};
  }
  if (message.name === 'reveal') return {votes, revealed: true};
  if (message.name === 'reset') return {votes: {}, revealed: false};
  return {votes, revealed};
}

export function Table({room}: { room: string }) {
  const [votes, setVotes] = useState<Record<string, VoteEntry>>({});
  const [revealed, setRevealed] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const {presenceData: players} = usePresenceListener<{ name: string }>(room);

  const {channel} = useChannel(room, 'vote', (message) => {
    if (!historyLoaded) return; // history replay will handle this
    const clientId = message.clientId ?? 'Unknown';
    setVotes(prev => ({...prev, [clientId]: message.data}));
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
      const page = await channel.history({limit: 100});
      if (cancelled) return;

      // History is newest-first; reverse to replay in chronological order
      const messages = [...page.items].reverse();
      let v: Record<string, VoteEntry> = {};
      let r = false;
      for (const msg of messages) {
        ({votes: v, revealed: r} = applyHistoryMessage(msg, v, r));
      }
      setVotes(v);
      setRevealed(r);
      setHistoryLoaded(true);
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div layout className="p-6">
      <h2 className="text-indigo-600 mb-4 text-xl font-bold">
        Votes
      </h2>
      <div className="grid gap-0" style={{gridTemplateColumns: `repeat(${players.length}, 1fr)`}}>
        <AnimatePresence>
          {players.map(({clientId, data}) => {
            const vote = votes[clientId];
            return (
              <motion.div
                key={clientId}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 20}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                className="flex flex-col items-center gap-2"
              >
                {vote
                  ? <Card label={vote.card} gifUrl={vote.gif.url} revealed={revealed}/>
                  : <CardPlaceholder className={'h-30'}/>
                }
                <span className="text-xs text-gray-700 font-medium">{data.name}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


