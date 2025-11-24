export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  accentColor: 'purple' | 'orange' | 'gray'| 'blue' | 'green'  | 'amber' | 'cyan' ; 
}

export interface IconProps {
  className?: string;
}