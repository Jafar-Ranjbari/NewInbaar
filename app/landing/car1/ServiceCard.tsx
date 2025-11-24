import React from 'react';
import { ServiceItem } from './type';

interface ServiceCardProps {
  item: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item }) => {
  const { title, description, Icon } = item;

  return (
    <div className="group relative mt-12 flex flex-col items-center bg-white rounded-[2rem] border border-teal-200 p-6 pt-16 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:border-teal-300">
      
      {/* Decorative Tab behind the circle */}
      <div className="absolute -top-[1px] left-1/2 h-8 w-16 -translate-x-1/2 rounded-b-full bg-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
      
      {/* Small teal accent marks mimicking the image connection points */}
      <div className="absolute -top-[2px] left-1/2 h-2 w-12 -translate-x-1/2 rounded-b-lg bg-teal-500"></div>

      {/* Floating Icon Container */}
      <div className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-white p-1">
        
        {/* Dashed Border Ring */}
        <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-dashed border-teal-400 bg-white transition-colors duration-300 group-hover:bg-teal-50 group-hover:border-teal-500">
          <Icon 
            size={36} 
            strokeWidth={1.5} 
            className="text-teal-600 transition-transform duration-300 group-hover:scale-110 group-hover:text-teal-700" 
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm leading-7 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
};
