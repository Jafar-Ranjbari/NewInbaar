import { Lightbulb, Server, Settings, BookOpen } from 'lucide-react';
import { ServiceItem } from './type';

export const SERVICE_ITEMS: ServiceItem[] = [
  {
    id: 1,
    title: "خدمات مشاوره و طراحی",
    description: "ارائه راهکارهای بهبود سازمانی مبتنی بر فناوری اطلاعات برای پاسخ‌دهی به نیازهای مشتریان",
    Icon: Lightbulb,
  },
  {
    id: 2,
    title: "شبکه و زیرساخت",
    description: "ارائه خدمات راه اندازی، نگهداری و مدیریت شبکه‌های کامپیوتری و زیرساخت IT در شرکت‌ها و سازمان‌ها در سطح کشور",
    Icon: Server,
  },
  {
    id: 3,
    title: "آموزش",
    description: "آموزش کاربران با فراهم آوردن فضای آموزشی مجهز و امکانات لازم در زمینه شناخت حوزه‌های ذیربط",
    Icon: Settings,
  },
  {
    id: 4,
    title: "استقرار و پشتیبانی",
    description: "فرایند خدمات پس از فروش و پشتیبانی مشتریان به کمک مرکز ارائه خدمات آنلاین و پشتیبانی از راه دور",
    Icon: BookOpen,
  },
];