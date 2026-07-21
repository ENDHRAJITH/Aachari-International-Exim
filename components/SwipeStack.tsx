'use client';

import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  hsn_code: string | null;
  imageUrl: string;
}

interface SwipeStackProps {
  products: Product[];
  cardWidth?: number;
  cardHeight?: number;
}

export default function SwipeStack({
  products,
  cardWidth = 320,
  cardHeight = 420,
}: SwipeStackProps) {
  const router = useRouter();
  const [cards, setCards] = useState(products);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    setCards(products);
  }, [products]);

  const handleDragEnd = (info: PanInfo, cardId: string) => {
    const { offset } = info;
    const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);

    if (distance > 60) {
      setCards((prev) => {
        const [top, ...rest] = prev;
        return top ? [...rest, top] : rest;
      });
    }
    setDraggedId(null);
  };

  const handleCardClick = (id: string) => {
    if (draggedId === id) return;
    router.push(`/catalogue/${id}`);
  };

  const getCardStyle = (index: number) => {
    const total = cards.length;
    if (total === 0) return {};

    const offset = index * 8;
    const scale = 1 - index * 0.06;
    const rotate = index === 0 ? 0 : -12 + index * 3;
    const x = index * 12;

    return {
      zIndex: total - index,
      scale,
      x,
      y: -offset,
      rotate,
    };
  };

  if (cards.length === 0) {
    return <div className="text-white">No products</div>;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div 
        className="relative"
        style={{ width: cardWidth, height: cardHeight, perspective: '1200px' }}
      >
        {cards.map((card, index) => {
          const isTop = index === 0;
          const style = getCardStyle(index);

          return (
            <motion.div
              key={card.id}
              drag={isTop}
              dragConstraints={{ left: -80, right: 80, top: -80, bottom: 80 }}
              dragElastic={0.6}
              onDragStart={() => setDraggedId(card.id)}
              onDragEnd={(_, info) => handleDragEnd(info, card.id)}
              onClick={() => isTop && handleCardClick(card.id)}
              animate={style}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              whileDrag={{ scale: 1.04, rotate: -8 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              style={{
                backgroundImage: `url(${card.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* HSN Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
                <span className="text-xs tracking-widest text-white/70">HSN CODE</span>
                <div className="bg-[#C1622A] text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                  {card.hsn_code ?? 'N/A'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}