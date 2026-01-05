export enum Role {
  DRIVER = "DRIVER",
  COMPANY = "COMPANY",
  ADMIN = "ADMIN",
}

export enum CompanyType {
  REAL = "REAL",
  LEGAL = "LEGAL",
}

export interface User {
  id: string;
  fullName: string;
  password?: string;
  rolename: Role;
  mobile: string;
  isComplete: Boolean;
}

export interface Driver {
  id: string;
  userID: string;
  firstName: string;
  lastName: string;
  nationalId: string; // اجباری
  mobile1: string; // اجباری
  province: string; // اجباری
  city: string; // اجباری
  mobile2?: string;
  address?: string;
  bloodType?: string;
  postalCode?: string;
  // Bank Info
  accountOwner?: string; // اختیاری
  accountHolderName?: string;
  accountHolderLastName?: string;
  accountHolderNationalId?: string;
  cardNumber?: string;
  shebaNumber?: string;
  // Images (URLs)
  nationalIdFront?: string;
  nationalIdBack?: string;
  accountHolderIdFront?: string;
  accountHolderIdBack?: string;
  driverIdFront?: string;
  driverIdBack?: string;
  license?: string;
  smartCard?: string;
  livePhoto?: string;
}

export interface DriverCar {
  id: string;
  driverID: string;
  owner?: string;
  vehicleType: string;
  carModel: string;
  licensePlate: string;
  loadCapacity?: string;
  coolingSystem?: string;
  rearBodyType?: string;
  vehicleColor?: string;
  // Images
  insuranceUrl?: string;
  cardUrl?: string;
  sideViewUrl?: string;
  frontViewUrl?: string;
  registrationUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  ownerID: string; // driverID or companyID
  balance_change: number;
  orders_change: number;
  description: string;
  timestamp: string;
}

export interface SmsCreditTransaction {
  id: string;
  userID: string;
  amount: number; // Credits added (e.g. 50)
  cost: number; // Cost in Tomans/Rials
  description: string;
  timestamp: string;
}

export interface Company {
  id: string;
  userID: string;
  type: CompanyType;
}

export interface CompanyDetail {
  id: string;
  companyID: string;

  // Common
  brandName: string;
  province: string;
  city: string;
  deliveryAddress: string;
  postalCode: string;
  workHoursFrom: string;
  workHoursTo: string;
  officePostalAddress: string;
  companyPostalAddress: string;

  // Rep Info
  repFirstName: string;
  repLastName: string;
  repMobile1: string;
  repMobile2?: string;
  repPhone?: string;
  repInternal?: string;
  repWhatsapp?: string;
  repEmail?: string;

  // Real
  real_firstName?: string;
  real_lastName?: string;
  real_nationalId?: string;
  real_socialSecurityCode?: string;

  // Legal
  legal_companyName?: string;
  legal_registrationNumber?: string;
  legal_nationalId?: string;
  legal_socialSecurityWorkshopCode?: string;
  legal_ceoName?: string;
  legal_ceoLastName?: string;

  officialGazette?: string;
  latestChangesGazette?: string;
  nationalCardFront?: string;
  nationalCardBack?: string;

  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  // 0. سفارش جدید ثبت شده (معمولاً در انتظار تایید اولیه سیستم یا ادمین)
  NEW = "NEW",
  //   // ۱. تعریف بار و در جستجوی راننده
  WAITING_FOR_OFFERS = "WAITING_FOR_OFFERS",

  // 3 منتطره  تایید راننده
  DRIVER_ACCEPTED_CONFIRMATION = "DRIVER_ACCEPTED_CONFIRMATION",

  //   // ۴. راننده بعداز  تایید  - در حال حرکت به سمت مبدا است
  DRIVER_TO_ANBAR = "DRIVER_TO_ORGIN",

  //  در  حال بارگیری
  LOADING = "LOADING",
  DELIVERED_ANBAR = "DELIVERED_ANBAR",
  DELIVERED_ANBAR_CONFIRMATION = "DELIVERED_ANBAR_CONFIRMATION",
  // بارگیری  تمام  به  سمت  مقصد
  ON_ROAD = "ON_ROAD",

  // تحویل  کالا   در مقصد
  DELIVERED = "DELIVERED",

  //   // ۸. شرکت تایید کرد که بار سالم تحویل شده است
  //   DELIVERY_CONFIRMED_BY_COMPANY = 'DELIVERY_CONFIRMED_BY_COMPANY',

  DELIVERED_CONFIRMATION = "DELIVERED_CONFIRMATION",
  // تسویه حساب کامل شده و سفارش پایان یافته است
  FINISHED = "FINISHED",

  // ۹. سفارش لغو شده است (توسط شرکت یا مدیر سیستم)
  CANCELED = "CANCELED",
  COMMENT_FOR_DRIVER = "COMMENT_FOR_DRIVER",
  // پرداخت پول به راننده
  PAY = "PAY",
}

// در  جستجوی  راننده   NEW
//  تایید پیشنهاد  راننده   WAITING_FOR_OFFERS
//  تایید  نهایی راننده   DRIVER_ACCEPTED_CONFIRMATION
//  در  مسیر  انبار   LOADING
//  تایید  دریافت بار  توسط  راننده  DELIVERED_ANBAR
//  تایید  دریافت  بار  توسط  شرکت  DELIVERED_ANBAR_CONFIRMATION
//  در  مسیر مقصد   ON_ROAD
//  تایید  تحویل بار  توسط راننده  DELIVERED
//  تایید  تحویل  بار  توسط  شرکت  DELIVERED_CONFIRMATION
//  وضعیت  تسویه  PAY
//  وضعیت نظر  سنجی  برای  راننده توسط شرکت
//  بار  تمام     FINISHED

// اگر  خود  شرکت  کنسل   کنه  یعنی بار  حذف میشه
//  اگر  راننده تایید شده  پیشنهاد قبول  نکنه .
//    میشه   در  جستجوی  راننده  -   خود بار
//  اینجا  orderOffers   میشه  کنسل
// این بخش برای مدیریت فرآیند "رد کردن" یا "پذیرفتن" قیمت‌های پیشنهادی رانندگان است.
export enum OfferStatus {
  PENDING = "PENDING", // پیشنهاد ثبت شده و منتظر بررسی شرکت
  ACCEPTED = "ACCEPTED", // شرکت این پیشنهاد را انتخاب کرده است
  REJECTED = "REJECTED", // شرکت این پیشنهاد را رد کرده است
  EXPIRED = "EXPIRED", // بار به شخص دیگری داده شد یا منقضی شد
  CANCELED = "CANCELED", //  این  بار
}

export interface Order {
  id?: string;
  expectedPriceRange: string; //
  companyID: string;
  status: OrderStatus;

  weightType: string; //
  loadType: string; // cargo type

  originProvince: string;
  originCity: string;

  destinationProvince: string;
  destinationCity: string;

  goodType: string; // نوع  کالا
  weight: number; //وزن
  size?: string; // سایز

  deliveryDate: string; //زمان
  requiredVehicleType: string;

  receiverName: string; // نام  گیرنده
  loadDescription: string; // فقط برای توضیحات "اضافی" و متفرقه

  // 💥 فیلدهای جدید برای جدا کردن داده‌ها 💥
  invoiceNumber: string; // شماره فاکتور
  receiverContact: string; // شماره تماس گیرنده
  packageType: string; // نوع بسته‌بندی
  packageCount: string; // تعداد بسته
  goodsValue?: number; // ارزش کالا (به صورت عدد)
  paymentMethod: string; // نحوه پرداخت کرایه
  unloadingAddress: string; // آدرس پستی محل تخلیه
  unloadingFromHour: string; // ساعت شروع کار انبار
  unloadingToHour: string; // ساعت پایان کار انبار

  // ⭐️ فیلد کلیدی برای نمایش قیمت در پنل راننده
  offers?: OrderOffer[]; // لیست تمامی پیشنهادهای ثبت شده برای این سفارش

  createdAt?: Date;
  driverID?: string; // راننده نهایی تخصیص داده شده
}

export interface OrderOffer {
  id: string;
  orderID: string;
  driverID: string;
  driverName?: string; // Helper to avoid extra lookups
  state: OfferStatus;
  price: number;
  commentDriver?: string;
  whyReject?: string;
  deliveryEstimateTime?: string;
  date: string;
}

export interface DriverReview {
  id: string;
  orderID: string;
  driverID: string;
  companyID: string;
  stars: number; // 1-5
  weaknesses: string[]; // e.g. ["Late", "Rude"]
  strengths: string[]; // e.g. ["Fast", "Polite"]
  commentText?: string;
  createdAt: string;
}

export interface PaymentDriver {
  id: string;
  driverID: string;
  orderID: string;
  amount: number;
  payType: "BANK" | "CASH" | "POS" | "CHARGE";
  image?: string; // Receipt URL
  transactionCode?: string;
  year: number;
  month: number;
  day: number;
  date: string; // ISO String for backup
  createdAt: string;
}

export enum AuthStep {
  PHONE_INPUT = "PHONE_INPUT",
  SMS_VERIFICATION = "SMS_VERIFICATION",
  LOGIN_PASSWORD = "LOGIN_PASSWORD",
  REGISTER = "REGISTER",
  FORGOT_PASSWORD_SMS = "FORGOT_PASSWORD_SMS",
  FORGOT_PASSWORD_NEW = "FORGOT_PASSWORD_NEW",
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  currentStep: AuthStep;
  tempMobile: string;
  tempUser: User | null;

  setStep: (step: AuthStep) => void;
  setTempMobile: (mobile: string) => void;
  setTempUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  // ✅ اینو اضافه کن
  setCurrentUser: (user: User | null) => void;
}

// types.ts

export interface User {
  id: string;
  fullName: string;
  password?: string;
  rolename: Role;
  mobile: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  currentStep: AuthStep;
  tempMobile: string;
  tempUser: User | null;
  isHydrated: boolean; // ⬅️ حفظ شد برای مدیریت SSR/CSR
  setHydrated: (state: boolean) => void;
  setStep: (step: AuthStep) => void;
  setTempMobile: (mobile: string) => void;
  setTempUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}
