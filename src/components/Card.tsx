import {type ComponentPropsWithoutRef} from 'react';
import {CardShell} from './CardShell.tsx';
import {CardFaceLabel} from './CardFaceLabel.tsx';
import {CardFaceGif} from './CardFaceGif.tsx';
import {CardBack} from './CardBack.tsx';

export {CardInteraction} from './CardInteraction.tsx';
export {CardRow} from './CardRow.tsx';
export {CardShell} from './CardShell.tsx';
export {CardFaceLabel} from './CardFaceLabel.tsx';
export {CardFaceGif} from './CardFaceGif.tsx';
export {CardBack} from './CardBack.tsx';

// ---------------------------------------------------------------------------
// Card – convenience composed component (backwards-compatible)
// ---------------------------------------------------------------------------

interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** The label/value shown on the card */
  label: string;
  /** Optional GIF to display as the card face */
  gifUrl?: string;
  /** Whether the card is face-up (revealed) */
  revealed?: boolean;
  /** Whether the card is currently selected */
  selected?: boolean;
}

export function Card({label, gifUrl, revealed = true, selected, className, ...rest}: CardProps) {
  const bg = revealed
    ? gifUrl
      ? 'bg-transparent'
      : 'bg-indigo-50'
    : gifUrl
      ? 'bg-transparent'
      : selected !== undefined
        ? selected
          ? 'bg-indigo-50'
          : 'bg-white'
        : 'bg-indigo-600';

  return (
    <CardShell bg={bg} selected={selected} className={className} {...rest}>
      {revealed
        ? gifUrl
          ? <CardFaceGif gifUrl={gifUrl}/>
          : <CardFaceLabel label={label}/>
        : <CardBack gifUrl={gifUrl}/>
      }
    </CardShell>
  );
}
