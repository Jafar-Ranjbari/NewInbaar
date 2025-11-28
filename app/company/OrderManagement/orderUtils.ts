import { OrderStatus } from "./../../types";

// Helper Function for Order Status Display
export const getStatusLabel = (status: OrderStatus): { label: string, color: string } => {
    switch (status) {
        case OrderStatus.NEW: return { label: "جدید (در انتظار پیشنهاد)", color: "bg-blue-100 text-blue-800" };
        case OrderStatus.DRIVER_ASSIGNED: return { label: "راننده تخصیص یافته", color: "bg-yellow-100 text-yellow-800" };
        case OrderStatus.DRIVER_EN_ROUTE: return { label: "در مسیر مبدا", color: "bg-orange-100 text-orange-800" };
        case OrderStatus.ON_ROAD: return { label: "در حال حمل", color: "bg-indigo-100 text-indigo-800" };
        case OrderStatus.DELIVERED: return { label: "تحویل شد", color: "bg-green-100 text-green-800" };
        case OrderStatus.FINISHED: return { label: "پایان یافته", color: "bg-gray-100 text-gray-800" };
        case OrderStatus.CANCELED: return { label: "لغو شده", color: "bg-red-100 text-red-800" };
        default: return { label: "نامشخص", color: "bg-gray-200 text-gray-700" };
    }
};