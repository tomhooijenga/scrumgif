export type KlipyResponse = {
  next: string;
  results: KlipyGif[]
}

export type KlipyGif = {
  id: string;
  title: string;
  url: string;
  media_formats: Record<MediaFormats, {
    url: string;
    dims: [number, number];
  }>
}

type MediaFormats = 'gif' // also others