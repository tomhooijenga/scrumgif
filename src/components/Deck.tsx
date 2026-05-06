import {useEffect, useState} from "react";
import {AnimatePresence, motion} from 'motion/react';

export const CARDS = [0, 1, 2, 3, 5, 8, 13, 20, 40, 'coffee', '?', '∞', 'break'];

const KLIPY_API_KEY = 'T2rXbk8t12Yhkz8xtVcyV3sdI2rqXCjRyJPVaH6sAWB74vA84fNS6DGRSL7PPGkw';

export interface KlipyGif {
  id: string;
  title: string;
  url: string;
}

export function CardPicker({
  selectedCard,
  onSelectCard,
}: {
  selectedCard: (typeof CARDS)[number] | undefined;
  onSelectCard: (card: (typeof CARDS)[number]) => void;
}) {
  return (
    <div className="flex overflow-auto p-8">
      <div className="flex gap-4 flex-wrap">
        {CARDS.map((c) => (
          <motion.div
            key={c}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            whileHover={{y: -8, scale: 1.06, boxShadow: '0px 0px 20px rgba(79,70,229,0.3)'}}
            whileTap={{scale: 0.95, transition: {delay: 0}}}
            onClick={() => onSelectCard(c)}
            className={[
              'h-30 aspect-2.5/3.5 rounded-lg flex items-center justify-center font-bold text-indigo-600 cursor-pointer select-none relative',
              typeof c === 'number' ? 'text-4xl' : 'text-base',
              selectedCard === c
                ? 'border-2 border-indigo-600 bg-indigo-50 [box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]'
                : 'border border-indigo-600 bg-white [box-shadow:3px_3px_8px_rgba(0,0,0,0.15),-1px_-1px_4px_rgba(255,255,255,0.8)]',
            ].join(' ')}
          >
            <span className="absolute top-1.5 left-2 text-[0.6rem] text-indigo-300">{c}</span>
            {c}
            <span className="absolute bottom-1.5 right-2 text-[0.6rem] text-indigo-300 rotate-180">{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GifPicker({
  card,
  selectedGif,
  onSelectGif,
}: {
  card: (typeof CARDS)[number] | undefined;
  selectedGif: KlipyGif | undefined;
  onSelectGif: (gif: KlipyGif) => void;
}) {
  const [fetchKey] = useState(0);
  const [gifs, setGifs] = useState<KlipyGif[]>([]);

  useEffect(() => {
    if (card === undefined) return;
    setGifs([]);
    const query = String(card);
    const controller = new AbortController();
    fetch(`https://api.klipy.com/v2/search?key=${KLIPY_API_KEY}&q=${encodeURIComponent(query)}&random=true&limit=8`, {signal: controller.signal})
      .then(res => res.json())
      .then(data => setGifs(data.results))
      .catch(err => { if ((err as Error).name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [card, fetchKey]);

  return (
    <AnimatePresence>
      {card !== undefined && (
        <motion.div
          initial={{opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: 16}}
          transition={{type: 'spring', stiffness: 260, damping: 20}}
          className={'h-57'}
        >
          <p className="text-gray-500 text-[0.85rem] mb-3 px-8">
            Click a GIF to confirm your vote.
          </p>
          <div className="flex gap-3 overflow-auto px-8 py-4">
            {gifs.map((gif) => (
              <motion.div
                key={gif.id}
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                whileHover={{scale: 1.04, boxShadow: '0px 0px 16px rgba(79,70,229,0.4)'}}
                whileTap={{scale: 0.96}}
                onClick={() => onSelectGif(gif)}
                className={[
                  'flex flex-col items-center gap-1.5 cursor-pointer rounded-[10px] border-2 p-1',
                  selectedGif?.id === gif.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-transparent',
                ].join(' ')}
              >
                <img
                  src={gif.url}
                  alt={gif.title ?? String(card)}
                  className="h-40 rounded-lg object-cover"
                  style={{ aspectRatio: `${(gif as any).media_formats?.gif?.dims[0]} / ${(gif as any).media_formats?.gif?.dims[1]}` }}
                />
                <span className="text-xs text-gray-500 text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {gif.title}
                </span>
              </motion.div>
            ))}
            {gifs.length === 0 && <p className="text-gray-500">Loading GIFs…</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}