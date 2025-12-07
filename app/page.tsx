 "use client"
import React, { useState, useEffect, useRef, ReactNode, MouseEvent } from 'react';

// --- Type Definitions ---
interface LinkProps {
  href: string;
  children: ReactNode;
  [key: string]: any;
}

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: (event: MouseEvent<HTMLImageElement>) => void;
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string | number;
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

interface Testimonial {
  name: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

// --- Components ---
const Link = ({ href, children, ...props }: LinkProps) => (
  <a href={href} {...props}>{children}</a>
);

const Image = ({ src, alt, width, height, className, onClick }: ImageProps) => (
  <img 
    src={src} 
    alt={alt} 
    width={width} 
    height={height} 
    className={className} 
    loading="lazy" 
    onClick={onClick} 
  />
);

// --- Helper Hook for Scroll Animation ---
 // --- Helper Hook for Scroll Animation ---
const useOnScreen = (options: IntersectionObserverInit): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsVisible(true);
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      }
    }, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, ref]);

  return [ref, isVisible];
};
// --- Animated Section Wrapper Component ---
const AnimatedSection = ({ children, className, id }: AnimatedSectionProps) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.1 });

  return (
    <div
      key={id}
      ref={ref}
      className={`${className || ''} transition-all duration-1000 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

// --- SVG Icons ---
const PlusIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const XIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// --- Reusable UI Components ---
const FaqItem = ({ question, answer, isOpen, onClick }: FaqItemProps) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden">
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center p-5 text-right font-semibold transition-colors duration-300 ${
        isOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'
      }`}
    >
      <span>{question}</span>
      <div 
        className={`transform transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        } p-1 rounded-full ${
          isOpen ? 'bg-white text-black' : 'bg-black text-white'
        }`}
      >
        {isOpen ? <XIcon /> : <PlusIcon />}
      </div>
    </button>
    <div 
      className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96' : 'max-h-0'
      }`}
    >
      <div className={`p-5 bg-black text-white`}>
        <p>{answer}</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(2);
  const defaultImage = "https://www.w3schools.com/css/img_5terre.jpg";

  const navLinks: string[] = ["درباره ما", "خدمات", "اخبار", "تماس با ما", "سوالات متداول"];
  
  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: "آیا اینبار از درآمد من کمیسیون دریافت می کند؟",
      answer: "خیر! اینبار هیچ کمیسیونی از درآمد راننده ها دریافت نمی کند. تمام درآمد شما مستقیما به حساب شما واریز می شود و شفافیت کامل رعایت شده است."
    },
    {
      question: "چطور بهترین مسیرها و بارها به من وصل می شوند؟",
      answer: "سیستم هوشمند اینبار با تحلیل داده ها، بهترین مسیرها و بارها را بر اساس موقعیت، نوع وسیله نقلیه و ترجیحات شما پیشنهاد می دهد."
    },
    {
      question: "آیا محدودیتی برای تعداد سفرها دارم؟",
      answer: "خیر، هیچ محدودیتی برای تعداد سفرهای شما وجود ندارد. شما می توانید به هر تعداد که مایلید سفر قبول کنید و درآمد کسب کنید."
    },
    {
      question: "هزینه ارسال بار چطور محاسبه می شود؟",
      answer: "هزینه ارسال بار بر اساس عوامل مختلفی مانند مسافت، وزن بار، نوع بار و شرایط جاده محاسبه می شود. اینبار تلاش می کند تا منصفانه ترین قیمت را برای رانندگان و صاحبان بار فراهم کند."
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "علی رضایی",
      company: "راننده پایه یک",
      quote: "از وقتی با اینبار کار میکنم، دیگه هیچوقت خالی برنمیگردم. همیشه بار برای مسیر برگشت هست و درآمدم خیلی بهتر شده.",
      avatar: defaultImage,
      rating: 5,
    },
    {
      name: "سارا احمدی",
      company: "مدیر لجستیک سیسام",
      quote: "پشتیبانی عالی و اپلیکیشن کاربرپسند. پیدا کردن راننده مطمئن هیچوقت اینقدر راحت نبوده. کاملا راضی هستیم.",
      avatar: defaultImage,
      rating: 4,
    },
    {
      name: "محمد فراهانی",
      company: "مدیر عامل شرکت اکوشیک",
      quote: "با اینبار هزینه حمل و نقلمون تا 20% کاهش پیدا کرده و کالاها همیشه به موقع میرسن. تجربه ای ساده و مطمئن برای شرکت ما بود.",
      avatar: defaultImage,
      rating: 5,
    },
    {
      name: "زهرا حسینی",
      company: "صاحب فروشگاه زنجیره ای",
      quote: "سرعت و اطمینان در حمل و نقل برای ما حیاتیه. اینبار این دو رو با هزینه کمتر برامون فراهم کرده.",
      avatar: defaultImage,
      rating: 5,
    },
    {
      name: "رضا قاسمی",
      company: "راننده کامیون",
      quote: "تسویه حساب سریع و به موقع. دیگه نگران پولم نیستم و با خیال راحت کار میکنم. ممنون از تیم اینبار.",
      avatar: defaultImage,
      rating: 5,
    },
  ];

  const handleFaqClick = (index: number): void => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleNextTestimonial = (): void => {
    setActiveTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrevTestimonial = (): void => {
    setActiveTestimonialIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeTestimonialIndex];

  return (
    <div className="bg-white text-gray-800 overflow-x-hidden">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link href="#" className="text-2xl font-black">inbaar</Link>
            </div>
            <nav className="hidden md:flex md:space-x-10 md:mr-10">
              {navLinks.map(link => (
                <Link key={link} href="#" className="font-medium text-gray-500 hover:text-gray-900">{link}</Link>
              ))}
            </nav>
            <div className="hidden md:block">
              <Link href="#" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800">
                شماره  تماس .... &rarr;
              </Link>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 right-0 left-0 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => (
                <Link key={link} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{link}</Link>
              ))}
            </div>
            <div className="p-4">
              <Link href="#" className="block w-full text-center px-5 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800">
                ثبت نام در اینبار &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-white">
          <AnimatedSection className="relative pt-16 pb-24 overflow-hidden container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <Image src="/landing/1.webp" alt="Logistics illustration" width={800} height={600} className="w-full h-auto" />
              </div>
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-right">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
                  <span className="block">اینبار، هردو طرف  </span>
                  <span className="block">برنده ان!</span>
                </h1>
                <p className="mt-6 text-lg text-gray-500">
                  راهی مدرن برای اتصال راننده و شرکت بدون واسطه
                </p>
                <div className="mt-8 flex gap-4 justify-center lg:justify-start">
                  <Link href="/auth" className="inline-block px-8 py-3.5 border border-transparent text-lg font-bold rounded-full text-white bg-black hover:bg-gray-800">ثبت نام شرکت ها</Link>
                  <Link href="/auth" className="inline-block px-8 py-3.5 border border-gray-300 text-lg font-bold rounded-full text-black bg-white hover:bg-gray-50">ثبت نام راننده ها</Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h2 className="text-4xl font-black">چرا اینبار؟</h2>
            </AnimatedSection>
            <div className="mt-16 space-y-16">
              {/* Feature 1 */}
              <AnimatedSection className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-1 md:order-1 text-center md:text-right">
                  <h3 className="text-3xl md:text-4xl font-black">اینبار، ازت کمیسیون نمیگیره!</h3>
                  <p className="mt-4 text-gray-500 text-lg">در اینبار سود بیشتر برای رانندگان و هزینه کمتر برای شرکت هاست. همه چیز شفاف و بدون واسطه.</p>
                  <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                    <Link href="#" className="px-6 py-2.5 border border-gray-300 font-bold rounded-full text-black bg-white hover:bg-gray-50">ثبت نام راننده ها</Link>
                    <div className="text-right">
                      <p className="font-black text-blue-600 text-2xl">+20000</p>
                      <p className="text-sm text-gray-500">تعداد راننده ها</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-2 md:order-2">
                  <div className="bg-blue-100 rounded-3xl p-8">
                    <Image src="/landing/2.webp" width={500} height={400} alt="No commission" className="w-full h-auto" />
                  </div>
                </div>
              </AnimatedSection>
              {/* Feature 2 */}
              <AnimatedSection className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <div className="bg-blue-100 rounded-3xl p-8">
                    <Image src="/landing/3.webp" width={500} height={400} alt="Lower cost" className="w-full h-auto" />
                  </div>
                </div>
                <div className="md:w-1/2 text-center md:text-right">
                  <h3 className="text-3xl md:text-4xl font-black">با اینبار، هزینه ی کمتری برای حمل کالاھات میدی!</h3>
                  <p className="mt-4 text-gray-500 text-lg">با اینبار، بارهایتان سریع تر و به صرفه تر به مقصد می رسند. و نیازی به راننده اضافی و یا واسطه نیست.</p>
                  <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                    <Link href="#" className="px-6 py-2.5 border border-gray-300 font-bold rounded-full text-black bg-white hover:bg-gray-50">ثبت نام شرکت ها</Link>
                    <div className="text-right">
                      <p className="font-black text-blue-600 text-2xl">+5000</p>
                      <p className="text-sm text-gray-500">تعداد شرکت ها</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              {/* Feature 3 */}
              <AnimatedSection className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 order-1 md:order-1 text-center md:text-right">
                  <h3 className="text-3xl md:text-4xl font-black">اینبار، خالی نمیری!</h3>
                  <p className="mt-4 text-gray-500 text-lg">سیستم هوشمند اینبار، بهترین بارها رو به تو وصل میکنه! درآمد مطمئن و بدون پرداخت کمیسیون.</p>
                  <div className="mt-6 flex items-center justify-center md:justify-start gap-4">
                    <Link href="#" className="px-6 py-2.5 border border-gray-300 font-bold rounded-full text-black bg-white hover:bg-gray-50">ثبت نام راننده ها</Link>
                    <div className="text-right">
                      <p className="font-black text-blue-600 text-2xl">+120000</p>
                      <p className="text-sm text-gray-500">جابه جایی کالا</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 order-2 md:order-2">
                  <div className="bg-blue-100 rounded-3xl p-8">
                    <Image src="/landing/4.webp" width={500} height={400} alt="Smart system" className="w-full h-auto" />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col md:flex-row items-center gap-12 bg-blue-50 p-8 rounded-3xl">
              <div className="md:w-1/2 text-center md:text-right">
                <h2 className="text-4xl font-black">ویدئو معرفی خدمات اینبار</h2>
                <p className="mt-4 text-gray-500 text-lg">در این ویدئو کوتاه سعی شده مختصری از توضیح آنچه اینبار در اختیار کاربران قرار میدهد به صورت خلاصه ارائه شود.</p>
                <div className="mt-6 flex gap-4 justify-center md:justify-start">
                  <Link href="#" className="px-6 py-2.5 border border-gray-300 font-bold rounded-full text-black bg-white hover:bg-gray-50">ویدئو رانندگان</Link>
                  <Link href="#" className="px-6 py-2.5 border border-gray-300 font-bold rounded-full text-black bg-white hover:bg-gray-50">ویدئو شرکت ها</Link>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <Image src="/landing/5.webp" alt="Service introduction video" width={600} height={400} className="rounded-2xl shadow-lg w-full h-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-blue-600 text-white rounded-full h-20 w-20 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <h2 className="text-4xl font-black">نظرات شرکت ها و رانندگان درباره اینبار</h2>
            </AnimatedSection>
            <AnimatedSection className="mt-12 max-w-2xl mx-auto" id={activeTestimonialIndex}>
              <div className="bg-white p-8 rounded-3xl shadow-lg relative">
                <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <Image src={activeTestimonial.avatar} alt={activeTestimonial.name} width={80} height={80} className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover" />
                </div>
                <div className="pt-10">
                  <div className="flex justify-center mb-4">
                    {[...Array(activeTestimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {[...Array(5 - activeTestimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-bold text-xl">{activeTestimonial.name}</h4>
                  <p className="text-gray-500">{activeTestimonial.company}</p>
                  <blockquote className="mt-4 text-gray-600 italic">
                    "{activeTestimonial.quote}"
                  </blockquote>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection className="mt-10 flex justify-center items-center space-x-4">
              <button onClick={handlePrevTestimonial} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
                <ChevronRightIcon />
              </button>
              <div className="flex space-x-2 sm:space-x-4 items-center">
                {testimonials.map((testimonial, index) => (
                  <Image
                    key={index}
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={activeTestimonialIndex === index ? 64 : 48}
                    height={activeTestimonialIndex === index ? 64 : 48}
                    onClick={() => setActiveTestimonialIndex(index)}
                    className={`rounded-full cursor-pointer object-cover transition-all duration-300 border-2 ${
                      activeTestimonialIndex === index
                        ? 'w-16 h-16 opacity-100 border-blue-500'
                        : 'w-10 h-10 sm:w-12 sm:h-12 opacity-50 hover:opacity-100 hover:border-gray-300 border-transparent'
                    }`}
                  />
                ))}
              </div>
              <button onClick={handleNextTestimonial} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100">
                <ChevronLeftIcon />
              </button>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h2 className="text-4xl font-black">سوالات متداول</h2>
              <p className="mt-4 text-gray-500">پاسخ سوالات خود را در دسته بندی های زیر پیدا کنید</p>
            </AnimatedSection>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {faqs.map((faq, index) => (
                  <AnimatedSection key={index}>
                    <FaqItem
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFaqIndex === index}
                      onClick={() => handleFaqClick(index)}
                    />
                  </AnimatedSection>
                ))}
              </div>
              <AnimatedSection className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Image src="/landing/6.webp" width={96} height={96} alt="Question mark illustration" className="w-24 h-24 mx-auto mb-4 object-contain" />
                  <h3 className="font-bold text-xl">سوالی دارید؟</h3>
                  <p className="text-gray-500 mt-2">اگر سوالی دارید که جوابش در این قسمت نیست در کادر زیر وارد کنید</p>
                  <textarea className="w-full mt-4 p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="اینجا بنویسید..."></textarea>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black">آخرین مقالات</h2>
              <div className="flex space-x-2">
                <button className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 text-gray-400">
                  <ChevronRightIcon />
                </button>
                <button className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 text-gray-400">
                  <ChevronLeftIcon />
                </button>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "اتصال بنادر ایرانی به کریدور های جهانی" }, 
                { title: "هزینه های حمل باعث افزایش بهای محصولات شرکت" }, 
                { title: "موانع توسعه اقتصاد جاده محور ایران" }
              ].map((article, i) => (
                <AnimatedSection key={i}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md group">
                    <Image src={defaultImage} alt={article.title} width={600} height={384} className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">{article.title}</h3>
                      <div className="flex justify-between items-center text-gray-500">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>۵:۰۰ دقیقه</span>
                        </div>
                        <Link href="#" className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg transform group-hover:-rotate-45 transition-transform duration-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="bg-blue-600 text-white rounded-3xl p-12 text-center md:text-right flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black">اینبار، انرژی خوب همکاری!</h2>
                  <p className="mt-2 text-blue-200 text-lg">با ما همراه شو تا کنار هم روزای کاری پر انرژی تری بسازیم.</p>
                </div>
                <div className="mt-6 md:mt-0">
                  <Link href="#" className="inline-block px-8 py-3.5 border border-transparent text-lg font-bold rounded-full text-blue-600 bg-white hover:bg-blue-50">
                    مشاهده فرصت های شغلی &larr;
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-black">اینبار فرق میکنه!</h3>
              <Link href="#" className="mt-4 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800">
                ثبت نام در اینبار &rarr;
              </Link>
            </div>
            <div>
              <h4 className="font-bold text-lg">اینبار</h4>
              <ul className="mt-4 space-y-2 text-gray-500">
                <li><Link href="#" className="hover:text-black">فرصت های شغلی</Link></li>
                <li><Link href="#" className="hover:text-black">سوالات متداول</Link></li>
                <li><Link href="#" className="hover:text-black">ارتباط با ما</Link></li>
                <li><Link href="#" className="hover:text-black">درباره ما</Link></li>
                <li><Link href="#" className="hover:text-black">بلاگ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg">خدمات</h4>
              <ul className="mt-4 space-y-2 text-gray-500">
                <li><Link href="#" className="hover:text-black">رانندگان</Link></li>
                <li><Link href="#" className="hover:text-black">شرکت ها</Link></li>
                <li><Link href="#" className="hover:text-black">بازرگانان تجاری</Link></li>
                <li><Link href="#" className="hover:text-black">فروشگاه های زنجیره ای</Link></li>
              </ul>
            </div>
            <div className="col-span-2 text-gray-500">
              <div className="flex items-center space-x-2 space-x-reverse">
                <p>پشتیبانی: 02144298442 | 09123233742</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse mt-2">
                <p>کرج . خیابان طالقانی . ساختمان پارس . طبقه اول</p>
              </div>
              <div className="flex space-x-4 mt-6">
                <Link href="#" className="text-gray-400 hover:text-black">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.286 2.571 7.91 6.138 9.387.447.082.61-.194.61-.431v-1.524c-2.4.522-2.904-1.155-2.904-1.155-.407-1.034-1-1.31-1-1.31-.812-.555.062-.544.062-.544.897.063 1.371.92 1.371.92.797 1.364 2.09 1.01 2.6  .772.082-.6.312-1.01.568-1.242-1.984-.225-4.068-1-4.068-4.422 0-.978.348-1.778.92-2.404-.092-.226-.398-1.138.087-2.37 0 0 .75-.24 2.45 1.02A8.56 8.56 0 0112 5.313c.75 0 1.5.102 2.2.304 1.7-1.26 2.45-1.02 2.45-1.02.485 1.232.18 2.144.088 2.37.572.626.918 1.426.918 2.404 0 3.432-2.086 4.195-4.076 4.416.32.276.608.82.608 1.652v2.445c0 .239.16.516.612.43C19.429 19.91 22 16.286 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-black">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-1.125 6.062c-1.42 0-2.57 1.15-2.57 2.57s1.15 2.57 2.57 2.57 2.57-1.15 2.57-2.57-1.15-2.57-2.57-2.57zm0 4.28c-.945 0-1.71-.765-1.71-1.71s.765-1.71 1.71-1.71 1.71.765 1.71 1.71-.765 1.71-1.71 1.71zm5.29-4.996c0 .54-.436.976-.976.976s-.976-.436-.976-.976.436-.976.976-.976.976.436.976.976zm2.81 1.42c-.092-1.19-.34-2.26-.79-3.21-.49-.95-1.12-1.7-1.94-2.3-1.03-.78-2.28-1.05-3.66-1.1-1.42-.05-1.76-.06-5.22-.06s-3.8.01-5.22.06c-1.38.05-2.63.32-3.66 1.1-.82.6-1.45 1.35-1.94 2.3-.45.95-.7 2.02-.79 3.21-.06 1.4-.07 1.75-.07 5.22s.01 3.82.07 5.22c.09 1.19.34 2.26.79 3.21.49.95 1.12 1.7 1.94 2.3 1.03.78 2.28 1.05 3.66 1.1 1.42.05 1.76.06 5.22.06s3.8-.01 5.22-.06c1.38-.05 2.63-.32 3.66-1.1.82-.6 1.45-1.35 1.94-2.3.45-.95-.7-2.02-.79-3.21.06-1.4.07-1.75.07-5.22s-.01-3.82-.07-5.22z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 inbaar | All Rights Reserved. تمام حقوق مادی و معنوی برای اینبار محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;