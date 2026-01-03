export const API_URL = 'http://localhost:4000';
export const COOKIE_NAME = 'auth_token';
export const SMS_MOCK_CODE = '12345';

export const PROVINCE_OPTIONS = ['تهران', 'فارس', 'اصفهان', 'خراسان رضوی', 'نامشخص'];
export const CITY_OPTIONS = ['شیراز', 'تهران', 'مشهد', 'اصفهان', 'کرج', 'نامشخص'];
export const CARGO_TYPE_OPTIONS = ['مواد غذایی', 'صنعتی', 'شیمیایی', 'ساختمانی', 'پوشاک', 'عمومی'];
export const PACKAGE_OPTIONS = ['کارتن', 'پالت', 'بشکه', 'گونی', 'فله'];
export const VEHICLE_TYPE_OPTIONS = ['وانت (بدون یخچال)', 'کامیون (بدون یخچال)', 'کامیونت (یخچالی)', 'تریلی', 'خاور مسقف'];
export const PAYMENT_OPTIONS = ['فرستده ', 'گیرنده'];

export interface WeatherDay {
  dayName: string;
  icon: 'storm' | 'rain' | 'partly-cloudy' | 'sun';
  isActive?: boolean;
}

export const WEATHER_DAYS: WeatherDay[] = [
  { dayName: 'جمعه', icon: 'storm' },
  { dayName: 'شنبه', icon: 'rain' },
  { dayName: 'یکشنبه', icon: 'partly-cloudy', isActive: true },
  { dayName: 'دوشنبه', icon: 'sun' },
  { dayName: 'سه شنبه', icon: 'rain' },
];