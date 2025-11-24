
import React from 'react';
import type { CardData } from './types';
// import Image from 'next/image';   

interface FeatureCardProps {
  card: CardData;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ card }) => {
  return (
    <div className="h-full bg-black text-white rounded-3xl p-6 flex flex-col overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="relative h-48 -m-6 mb-6">
        <img src={card.imageUrl} alt={card.title} className="w-full h-full " />
        {/* <Image  src={card.imageUrl} alt={card.title} className='=' */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>
      <div className="flex-grow flex flex-col text-right">
        <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
        {/* <p className="text-gray-300 text-base flex-grow mb-6">{card.description}</p> */}
        <button className="mt-auto bg-[#140a82] hover:bg-blue-400 hover:cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
          {card.buttonText}
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
