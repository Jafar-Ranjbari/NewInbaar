import Hero from "./landing/Hero";
import FeatureCardLanding from "./components/FeatueCard/FeatureCardLanding";
import Faq from "./landing/Faq";
import FeatureSectionlanding from "./components/featureSection/FeatureSectionlanding";
import HeroSectionLanding from "./landing/HeroSectionLanding";
import AllServiceCard2 from "./landing/car2/AllServiceCard2";
import AllServiceCard3 from "./landing/car3/AllServiceCard3";

const Page = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-bl from-[#000516] via-[#020d2b] to-[#0b1d48] opacity-70"></div>
      <div className="relative z-10">
        <Hero />
        <FeatureCardLanding />
        <AllServiceCard3 />
        <HeroSectionLanding />
        <FeatureSectionlanding />
        <Faq />
        {/* <AllServiceCard/> */}
        <AllServiceCard2/> 
      </div>
    </div>
  );
};

export default Page;
