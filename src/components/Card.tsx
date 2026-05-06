import {type ComponentPropsWithoutRef} from 'react';

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** The label/value shown on the card */
  label: string | number;
  /** Optional GIF to display as the card face */
  gifUrl?: string;
  /** Whether the card is face-up (revealed) */
  revealed?: boolean;
  /** Whether the card is currently selected */
  selected?: boolean;
}

export function Card({label, gifUrl, revealed = true, selected, className, ...rest}: CardProps) {
  const isText = isNaN(Number(label));

  const bg = revealed
    ? gifUrl ? 'bg-transparent' : 'bg-indigo-50'
    : gifUrl ? 'bg-transparent' : selected !== undefined
      ? selected ? 'bg-indigo-50' : 'bg-white'
      : 'bg-indigo-600';

  const textColor = revealed ? 'text-indigo-600' : 'text-indigo-300';

  const border = selected !== undefined
    ? selected
      ? 'border-2 border-indigo-600 [box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]'
      : 'border border-indigo-600 [box-shadow:3px_3px_8px_rgba(0,0,0,0.15),-1px_-1px_4px_rgba(255,255,255,0.8)]'
    : 'border-2 border-indigo-600 [box-shadow:0px_0px_20px_rgba(79,70,229,0.4),3px_3px_8px_rgba(0,0,0,0.15)]';

  return (
    <div
      className={[
        'h-30 aspect-2.5/3.5 rounded-[10px] flex items-center justify-center font-bold overflow-hidden relative select-none',
        isText ? 'text-base' : 'text-4xl',
        textColor,
        bg,
        border,
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {revealed ? (
        <>
          {gifUrl && (
            <img
              src={gifUrl}
              alt={String(label)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <span
            className={`absolute top-1.5 left-2 text-[0.6rem] ${gifUrl ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]' : 'text-indigo-300'}`}>
            {label}
          </span>
          <span
            className={`relative z-10 ${isText ? 'text-base' : 'text-4xl'} ${gifUrl ? 'text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.7)]' : 'text-indigo-600'}`}>
            {label}
          </span>
          <span
            className={`absolute bottom-1.5 right-2 text-[0.6rem] rotate-180 ${gifUrl ? 'text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]' : 'text-indigo-300'}`}>
            {label}
          </span>
        </>
      ) : gifUrl ? (
        <img
          src={gifUrl}
          alt={String(label)}
          className="w-full h-full object-cover rounded-lg blur-md scale-110"
        />
      ) : (
        <span className="text-4xl text-indigo-400">🂠</span>
      )}
    </div>
  );
}

