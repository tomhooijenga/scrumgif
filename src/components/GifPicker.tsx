import {useEffect, useState} from "react";
import {AnimatePresence, motion} from 'motion/react';
import type {Card} from "../types/Card.ts";
import type {KlipyResponse, KlipyGif} from "../types/KlipyResponse.ts";

export function GifPicker({
                            card,
                            selectedGif,
                            onSelectGif,
                          }: {
  card: Card | undefined;
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
    fetch(`https://api.klipy.com/v2/search?key=${import.meta.env.VITE_KLIPY_API_KEY}&q=${encodeURIComponent(query)}&random=true&limit=8`, {signal: controller.signal})
      .then(res => res.json() as unknown as KlipyResponse)
      .then(data => setGifs(data.results))
      .catch(err => {
        if ((err as Error).name !== 'AbortError') console.error(err);
      });
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
                  style={{aspectRatio: `${(gif).media_formats?.gif?.dims[0]} / ${(gif).media_formats?.gif?.dims[1]}`}}
                />
                <span
                  className="text-xs text-gray-500 text-center max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
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