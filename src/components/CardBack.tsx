export function CardBack({gifUrl}: { gifUrl?: string }) {
  if (gifUrl) {
    return (
      <img
        src={gifUrl}
        alt=""
        className="w-full h-full object-cover rounded-lg blur-md scale-110"
      />
    );
  }
  return <span className="text-4xl text-indigo-400">🂠</span>;
}

