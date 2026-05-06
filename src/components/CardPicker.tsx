import {motion} from 'motion/react';
import {Card} from "./Card.tsx";
import {CARDS} from "./GifPicker.tsx";

export function CardPicker({
                             selectedCard,
                             onSelectCard,
                           }: {
  selectedCard: (typeof CARDS)[number] | undefined;
  onSelectCard: (card: (typeof CARDS)[number]) => void;
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
            <Card label={c} selected={selectedCard === c} revealed={false} className="cursor-pointer" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}