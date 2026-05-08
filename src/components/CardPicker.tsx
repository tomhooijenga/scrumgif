import {Card} from "./Card.tsx";
import {CardInteraction} from "./CardInteraction.tsx";
import {CardRow} from "./CardRow.tsx";
import type {Card as CardType} from '../types/Card.ts'

const CARDS: CardType[] = ['0', '1', '2', "3", '5', "8", "13", "20", "40", 'coffee', '?', '∞', 'break'];

export function CardPicker({
                             selectedCard,
                             onSelectCard,
                           }: {
  selectedCard: CardType | undefined;
  onSelectCard: (card: CardType) => void;
}) {
  return (
    <CardRow>
      {CARDS.map((c) => (
        <CardInteraction key={c} onClick={() => onSelectCard(c)}>
          <Card label={c} selected={selectedCard === c} className="cursor-pointer"/>
        </CardInteraction>
      ))}
    </CardRow>
  );
}