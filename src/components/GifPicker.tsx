import {useEffect, useState} from "react";
import type {Card} from "../types/Card.ts";
import type {KlipyGif, KlipyResponse} from "../types/KlipyResponse.ts";
import {CardFaceGif} from "./CardFaceGif.tsx";
import {CardInteraction} from "./CardInteraction.tsx";
import {CardRow} from "./CardRow.tsx";
import {CardShell} from "./CardShell.tsx";

function getRandomPage() {
  const max = 200;
  const min = 0;
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function GifPicker({
                            card,
                            fetchKey,
                            selectedGif,
                            onSelectGif,
                          }: {
  card: Card | undefined;
  fetchKey: number;
  selectedGif: KlipyGif | undefined;
  onSelectGif: (gif: KlipyGif) => void;
}) {
  const [gifs, setGifs] = useState<KlipyGif[]>([]);

  useEffect(() => {
    if (card === undefined) return;
    setGifs([]);
    const controller = new AbortController();
    fetch(`https://api.klipy.com/api/v1/${import.meta.env.VITE_KLIPY_API_KEY}/gifs/search?q=${encodeURIComponent(card)}&per_page=8&page=${getRandomPage()}`, {signal: controller.signal})
      .then(res => res.json() as unknown as KlipyResponse)
      .then(data => setGifs(data.data.data))
      .catch(err => {
        if ((err as Error).name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, [card, fetchKey]);

  return (
    <>
      <p className="text-gray-500 text-[0.85rem] mb-3">
        Click a GIF to confirm your vote.
      </p>
      <CardRow>
        {gifs.map((gif) => (
          <CardInteraction
            key={gif.id}
            onClick={() => onSelectGif(gif)}
          >
            <CardShell
              bg="bg-transparent"
              selected={selectedGif?.id === gif.id}
            >
              <CardFaceGif gifUrl={gif.file.sm.gif.url}/>
            </CardShell>
          </CardInteraction>
        ))}
      </CardRow>
    </>
  );
}