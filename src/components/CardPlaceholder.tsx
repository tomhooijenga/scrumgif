export function CardPlaceholder({className}: { className: string }) {
  return (
    <div
      className={`aspect-2.5/3.5 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300 text-4xl text-indigo-200 select-none ${className}`}>🂠</div>
  );
}

