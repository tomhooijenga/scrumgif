export type KlipyResponse = {
  result: true;
  data: {
    data: KlipyGif[];
  }
}

export type KlipyGif = {
  id: string;
  title: string;
  file: Record<
    KlipyFileSize,
    Record<KlipyFileType, KlipyFile>
  >
}

type KlipyFileSize = 'sm'

type KlipyFileType = 'gif';

export type KlipyFile = {
  url: string;
  width: number;
  height: number;
}