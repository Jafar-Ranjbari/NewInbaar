 import React from 'react';

const heroImageUrl = "/images/heroSectionLanding.webp";

const appStoreBadgeUrl = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg";
const googlePlayBadgeUrl = "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png";

const HeroSectionLanding: React.FC = () => {
  return (
    <section className="relative overflow-hidden flex items-center justify-center py-5 lg:py-0">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-teal-900/60 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          
          {/* Image Content - moved before text */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start mb-8 lg:mb-0">
            <img
              src={heroImageUrl}
              alt="inbaar trading app on mobile phones"
              className="w-56 h-56 sm:w-72 sm:h-72 lg:w-full lg:h-auto lg:max-w-3xl 
                         rounded-full lg:rounded-none object-cover shadow-lg transition-all duration-300"
            />
          </div>

          {/* Text Content */}
          <div className="lg:w-[45%] text-center lg:text-right">
            <span className="text-blue-400 text-sm font-semibold mb-4 block">
              اپلیکیشن موبایل جدید  inbaar
            </span>
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
              در حال حرکت    
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
               inbaar
              همین حالا برنامه این  بار  را دانلود کنید!
            </p>

            <div className="flex justify-center lg:justify-start items-center space-x-4 space-x-reverse">
              <a
                href="#"
                aria-label="Download on the App Store"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <img src={appStoreBadgeUrl} alt="Download on the App Store" className="h-12" />
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play"
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <img src={googlePlayBadgeUrl} alt="Get it on Google Play" className="h-[68px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionLanding;
