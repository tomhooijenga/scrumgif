import {Card} from "./Card.tsx";
import {CardInteraction} from "./CardInteraction.tsx";
import {CardRow} from "./CardRow.tsx";
import type {Card as CardType} from '../types/Card.ts'

const CARDS: CardType[] = ['0', '1', '2', "3", '5', "8", "13", "20", "40", 'coffee', '?', '∞', 'break'];

export function CardPicker({
                             className,
                             selectedCard,
                             onSelectCard,
                           }: {
  className: string | undefined
  selectedCard: CardType | undefined;
  onSelectCard: (card: CardType) => void;
}) {
  return (
    <CardRow className={className}>
      {CARDS.map((c) => (
        <CardInteraction key={c} onClick={() => onSelectCard(c)}>
          <Card label={c} selected={selectedCard === c} className="h-30 cursor-pointer"/>
        </CardInteraction>
      ))}
    </CardRow>
  );
}