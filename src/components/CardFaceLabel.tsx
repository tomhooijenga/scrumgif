export function CardFaceLabel({label}: { label: string }) {
  const isText = isNaN(Number(label));

  return (
    <>
      <span className="absolute top-1.5 left-2 text-[0.6rem] text-indigo-300">
        {label}
      </span>
      <span className={`relative z-10 ${isText ? 'text-base' : 'text-4xl'} text-indigo-600`}>
        {label}
      </span>
      <span className="absolute bottom-1.5 right-2 text-[0.6rem] rotate-180 text-indigo-300">
        {label}
      </span>
    </>
  );
}

