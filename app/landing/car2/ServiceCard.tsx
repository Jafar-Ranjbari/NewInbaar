 import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceData } from './type';

interface ServiceCardProps {
  data: ServiceData;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ data, index }) => {
  const Icon = data.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 z-10" />
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        
        {/* Floating Icon Badge - Positioned on the Right for RTL */}
        <div className="absolute bottom-0 right-8 translate-y-1/2 z-20">
          <div className="bg-white p-3.5 rounded-full shadow-lg border-4 border-white text-brand-DEFAULT group-hover:text-blue-600 group-hover:scale-110 transition-transform duration-300">
            <Icon size={32} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-12 flex-grow flex flex-col text-right">
        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-brand-DEFAULT transition-colors duration-300 line-clamp-2 min-h-[3.5rem] leading-tight">
          {data.title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-7 mb-6 flex-grow line-clamp-3">
          {data.description}
        </p>

        {/* Button - Aligned to the Left (End in RTL) */}
        <div className="mt-auto self-end pt-4 border-t border-gray-50 w-full flex justify-end">
          <button className="flex items-center gap-2 text-sm font-medium text-brand-dark bg-blue-50/80 hover:bg-blue-100 px-6 py-2.5 rounded-lg transition-all duration-300 group/btn">
            <span>{data.linkText}</span>
            <ArrowLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
