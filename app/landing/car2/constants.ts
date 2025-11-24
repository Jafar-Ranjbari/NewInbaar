import { ServiceData } from './type';
import { Server, ShieldCheck, Factory, Activity } from 'lucide-react';

export const SERVICES: ServiceData[] = [
  {
    id: 1,
    title: "زیرساخت",
    description: "گروه زیرساخت این شرکت با تمرکز بر دسترسی‌پذیری، یکی از ارکان امنیت اطلاعات است...",
    image: "https://images.unsplash.com/photo-1558494949-ef526b01201b?auto=format&fit=crop&q=80&w=800",
    icon: Server,
    linkText: "مطالعه بیشتر"
  },
  {
    id: 2,
    title: "تامین امنیت شبکه و سامانه های اطلاعاتی",
    description: "شناسایی آسیب‌پذیری‌ها و کشف نقاط ضعف دارایی‌های سازمان و ارائه راهکارهای امنیتی...",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    icon: ShieldCheck,
    linkText: "مطالعه بیشتر"
  },
  {
    id: 3,
    title: "مشاوره، طراحی، پیاده‌سازی امنیت شبکه‌های صنعتی",
    description: "مشاوره، طراحی، پیاده‌سازی امنیت سایبری در زیرساخت‌های حساس و حیاتی و ارائه طرح...",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    icon: Factory,
    linkText: "مطالعه بیشتر"
  },
  {
    id: 4,
    title: "مرکز عملیات امنیت (SOC)",
    description: "SOC با پایش لحظه‌ای و واکنش سریع از دارایی‌های حیاتی در برابر تهدیدات سایبری محافظت می‌کند...",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    icon: Activity,
    linkText: "مطالعه بیشتر"
  }
];
