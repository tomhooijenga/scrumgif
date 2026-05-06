import {useEffect, useState} from "react";
import {AnimatePresence, motion} from 'motion/react';

export const CARDS = [0, 1, 2, 3, 5, 8, 13, 20, 40, 'coffee', '?', '∞', 'break'];

const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Adwaita Sans, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif';

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
      <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        {CARDS.map((c) => (
          <motion.div
            key={c}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            whileHover={{y: -8, scale: 1.06, boxShadow: '0px 0px 20px rgba(79,70,229,0.3)'}}
            whileTap={{scale: 0.95, transition: {delay: 0}}}
            onClick={() => onSelectCard(c)}
            style={{
              aspectRatio: '2.5/3.5',
              height: '120px',
              borderRadius: '10px',
              border: selectedCard === c ? '2px solid #4f46e5' : '1px solid #4f46e5',
              boxShadow: selectedCard === c
                ? '0px 0px 20px rgba(79,70,229,0.4), 3px 3px 8px rgba(0,0,0,0.15)'
                : '3px 3px 8px rgba(0,0,0,0.15), -1px -1px 4px rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: typeof c === 'number' ? '2rem' : '1rem',
              fontWeight: 'bold',
              color: '#4f46e5',
              fontFamily: SYSTEM_FONT,
              cursor: 'pointer',
              userSelect: 'none',
              position: 'relative',
              background: selectedCard === c ? '#eef2ff' : 'white',
            }}
          >
            <span style={{position: 'absolute', top: '6px', left: '8px', fontSize: '0.6rem', color: '#a5b4fc'}}>{c}</span>
            {c}
            <span style={{position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.6rem', color: '#a5b4fc', transform: 'rotate(180deg)'}}>{c}</span>
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
          <p style={{color: '#6b7280', fontSize: '0.85rem', marginBottom: '12px'}} className={'px-8'}>
            Click a GIF to confirm your vote.
          </p>
          <div style={{display: 'flex', gap: '12px', overflow: 'auto'}} className={'px-8 py-4'}>
            {gifs.map((gif) => (
              <motion.div
                key={gif.id}
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
                whileHover={{scale: 1.04, boxShadow: '0px 0px 16px rgba(79,70,229,0.4)'}}
                whileTap={{scale: 0.96}}
                onClick={() => onSelectGif(gif)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  border: selectedGif?.id === gif.id ? '2px solid #4f46e5' : '2px solid transparent',
                  padding: '4px',
                  background: selectedGif?.id === gif.id ? '#eef2ff' : 'transparent',
                }}
              >
                <img
                  src={gif.url}
                  alt={gif.title ?? String(card)}
                  style={{
                    height: '160px',
                    aspectRatio: `${(gif as any).media_formats?.gif?.dims[0]} / ${(gif as any).media_formats?.gif?.dims[1]}`,
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <span style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  textAlign: 'center',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {gif.title}
                </span>
              </motion.div>
            ))}
            {gifs.length === 0 && <p style={{color: '#6b7280'}}>Loading GIFs…</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}