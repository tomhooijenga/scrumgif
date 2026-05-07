import {motion} from 'motion/react';
import {Card} from "./Card.tsx";
import type { Card as CardType } from '../types/Card.ts'

const CARDS: CardType[] = ['0', '1', '2', "3", '5', "8", "13", "20", "40", 'coffee', '?', '∞', 'break'];

export function CardPicker({
                             selectedCard,
                             onSelectCard,
                           }: {
  selectedCard: CardType | undefined;
  onSelectCard: (card: CardType) => void;
}) {
  return (
    <div className="flex overflow-auto p-8">
      <div className="flex gap-4 flex-wrap">
        {CARDS.map((c) => (
          <motion.div
            key={c}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{type: 'spring', stiffness: 260, damping: 20}}
            whileHover={{y: -8, scale: 1.06, boxShadow: '0px 0px 20px rgba(79,70,229,0.3)'}}
            whileTap={{scale: 0.95, transition: {delay: 0}}}
            onClick={() => onSelectCard(c)}
          >
            <Card label={c} selected={selectedCard === c} className="cursor-pointer"/>
          </motion.div>
        ))}
      </div>
    </div>
  );
}