
import React from 'react';

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  linkText: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
}

const ArrowLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);


const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  subtitle,
  description,
  linkText,
  imageUrl,
  imagePosition,
}) => {
  const textOrder = imagePosition === 'left' ? 'md:order-last' : '';
  const textAlign = 'text-right';

  return (
    <section className="py-5 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className={`flex justify-center items-center ${textOrder === '' ? 'md:order-first' : textOrder}`}>
          {/* Using img tag as Next.js Image component is not available in this environment */}
          <img
            src={imageUrl}
            alt="Feature demonstration"
            className="rounded-xl shadow-2xl w-full h-auto object-cover object-center"
            width={800}
            height={600}
          />
        </div>
        <div className={`${textAlign}`}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">{title}</h2>
          <h3 className="text-xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6">{subtitle}</h3>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
          <button className="mt-auto   bg-[#140a82] hover:bg-blue-400 hover:cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
            {linkText}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
