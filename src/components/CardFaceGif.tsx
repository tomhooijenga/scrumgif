export function CardFaceGif({gifUrl}: { gifUrl: string }) {
  return (
    <img
      src={gifUrl}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

