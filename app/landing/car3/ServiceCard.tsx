import React from 'react';
import { NewsItem } from './type';
import { CalendarIcon, ArrowLeftIcon } from './Icons';

interface NewsCardProps {
  item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  // Determine gradient/color based on mock data accent
  const getGradient = (color: string) => {
    switch (color) {
      case 'red':
        return 'from-red-600 to-rose-900';
      case 'teal':
        return 'from-red-500 via-rose-500 to-teal-400';
      case 'gray':
        return 'from-gray-700 to-black';
      default:
        return 'from-blue-600 to-blue-800';
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'red':
      case 'gray':
        return 'bg-amber-500 text-white';
      case 'teal':
        return 'bg-yellow-400 text-slate-900';
      default:
        return 'bg-amber-500 text-white';
    }
  };

  return (
    <div 
      className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden border border-slate-100 flex flex-col h-full transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${getGradient(item.accentColor)}`}>
        {/* Placeholder image overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-transform duration-700 group-hover:scale-105">
           <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover mix-blend-overlay opacity-50"
          />
          {/* Main Visual Element (mocking the robots/cameras in the screenshot) */}
          <div className="absolute inset-0 flex items-center justify-center">
             <img 
                src={item.imageUrl} 
                className="h-4/5 w-auto object-contain drop-shadow-2xl filter contrast-125"
                alt="Subject"
             />
          </div>
        </div>

        {/* Badge - Positioned Top Left due to RTL context (visually top right in screenshot) */}
        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg z-10 ${getBadgeColor(item.accentColor)}`}>
          {item.category}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <h3 className="text-xl font-bold text-slate-800 leading-relaxed mb-6 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          {/* Date Section */}
          <div className="flex items-center text-slate-400 text-sm font-medium gap-2">
            <span>{item.date}</span>
            <CalendarIcon className="w-5 h-5" />
          </div>

          {/* Action Button */}
          <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:bg-blue-100 active:bg-blue-200">
             <ArrowLeftIcon className="w-4 h-4" />
             <span>مطالعه بیشتر</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;