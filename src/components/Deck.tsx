import {useEffect, useState} from "react";
import {AnimatePresence, motion} from 'motion/react';

const CARDS = [0, 1, 2, 3, 5, 8, 13, 20, 40, 'coffee', '?', '∞', 'break'];

const SYSTEM_FONT = '-apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, Adwaita Sans, Cantarell, Ubuntu, roboto, noto, helvetica, arial, sans-serif';

const KLIPY_API_KEY = 'T2rXbk8t12Yhkz8xtVcyV3sdI2rqXCjRyJPVaH6sAWB74vA84fNS6DGRSL7PPGkw';

interface KlipyGif {
  id: string;
  title: string;
  url: string
}

export function Deck({ onSelectCard }: { onSelectCard: (card: string) => void }) {
  const [card, setCard] = useState<(typeof CARDS)[number] | undefined>();
  const [fetchKey, setFetchKey] = useState(0);
  const [gifs, setGifs] = useState<KlipyGif[]>([]);

  useEffect(() => {
    if (card === undefined) return;
    const query = String(card);
    const controller = new AbortController();

    fetch(`https://api.klipy.com/v2/search?key=${KLIPY_API_KEY}&q=${encodeURIComponent(query)}&random=true&limit=8`, {signal: controller.signal})
      .then(res => res.json())
      .then(data => {
        setGifs(data.results);
      })
      .catch(err => {
        if ((err as Error).name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, [card, fetchKey]);
  return (
    <div style={{padding: '24px', fontFamily: SYSTEM_FONT}}>
      <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        {CARDS.map((c) => (
          <motion.div
            key={c}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            whileHover={{y: -8, scale: 1.06, boxShadow: '0px 0px 20px rgba(79,70,229,0.3)'}}
            whileTap={{scale: 0.95, transition: {delay: 0}}}
            onClick={() => {
              setCard(c);
              setFetchKey(k => k + 1);
              onSelectCard(String(c));
            }}
            style={{
              aspectRatio: '2.5/3.5',
              height: '120px',
              borderRadius: '10px',
              border: card === c ? '2px solid #4f46e5' : '1px solid #4f46e5',
              boxShadow: card === c
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
              background: card === c ? '#eef2ff' : 'white',
            }}
          >
            <span
              style={{position: 'absolute', top: '6px', left: '8px', fontSize: '0.6rem', color: '#a5b4fc'}}>{c}</span>
            {c}
            <span style={{
              position: 'absolute',
              bottom: '6px',
              right: '8px',
              fontSize: '0.6rem',
              color: '#a5b4fc',
              transform: 'rotate(180deg)'
            }}>{c}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {card !== undefined && (
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 16}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            style={{marginTop: '32px'}}
          >
            <h3 style={{color: '#4f46e5', marginBottom: '12px', fontFamily: SYSTEM_FONT}}>
              GIFs for "{card}"
            </h3>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {gifs.map((gif) => (
                <motion.div
                  key={gif.id}
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{type: 'spring', stiffness: 260, damping: 20}}
                  style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'}}
                >
                  <img
                    src={gif.url}
                    alt={gif.title ?? String(card)}
                    style={{
                      height: '160px',
                      aspectRatio: `${gif.media_formats.gif.dims[0]} / ${gif.media_formats.gif.dims[1]}`,
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    textAlign: 'center',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {gif.title}
                  </span>
                </motion.div>
              ))}
              {gifs.length === 0 && (
                <p style={{color: '#6b7280'}}>No GIFs found.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  )
}