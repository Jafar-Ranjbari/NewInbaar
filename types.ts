export enum Role {
  DRIVER = 'DRIVER',
  COMPANY = 'COMPANY'
}

export enum CompanyType {
  REAL = 'REAL',
  LEGAL = 'LEGAL'
}

export enum OrderStatus {
  NEW = 'NEW',
  WAITING_FOR_DRIVER = 'WAITING_FOR_DRIVER',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DELIVERING = 'DELIVERING',
  FINISHED = 'FINISHED'
}

export interface User {
  id: string;
  fullName: string;
  password?: string;
  rolename: Role;
  mobile: string;
}

export interface Driver {
  id: string;
  userID: string;
  firstName: string;
  lastName: string;
  mobile1: string;
  province: string;
  city: string;
  mobile2?: string;
  address?: string;
  bloodType?: string;
  postalCode?: string;
  // Bank Info
  accountOwner?: string;
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

  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  companyID: string;
  loadType: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  receiverName: string;
  goodType: string;
  weight: number;
  size?: string;
  status: OrderStatus;
  expectedPriceRange?: string;
  deliveryDate: string;
  loadDescription?: string;
  distanceKm?: number;
  weightType: 'KG' | 'TON';
  requiredVehicleType?: string;
  createdAt: string;
}

export enum AuthStep {
  PHONE_INPUT = 'PHONE_INPUT',
  LOGIN_PASSWORD = 'LOGIN_PASSWORD',
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD_SMS = 'FORGOT_PASSWORD_SMS',
  FORGOT_PASSWORD_NEW = 'FORGOT_PASSWORD_NEW',
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
}