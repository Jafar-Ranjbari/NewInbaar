"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { 
    Order, 
    OrderStatus, 
    OfferStatus, 
    PaymentDriver, 
    DriverReview, 
    CompanyType 
} from "../../types";
import {
    getCompanyOrders,
    getCompanyByUserId,
    createCompany,
    // ... بقیه توابع سرویس (مانند updateOrder, createPayment, createReview)
} from "../companyService"; // مسیر سرویس‌ها
import {
    X,
    Search,
    Filter,
    PackagePlus,
    FileText,
    Loader2,
    Truck,
    MapPin,
    Eye,
} from "lucide-react";
import { getStatusLabel } from "./orderUtils";
import OrderActionModal from "./OrderActionModal";

// Import Helper Modals/Components
// اینها را در فایل‌های جداگانه تعریف می‌کنیم:
// import OrderActionModal from './OrderActionModal';
// import { OffersSection, ManagementActions, getStatusLabel } from './OrderHelpers';

// ---------------- Helper Data ----------------
const statusFilters: { value: OrderStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'همه سفارشات' },
    { value: OrderStatus.NEW, label: 'جدید (در انتظار پیشنهاد)' },
    { value: OrderStatus.DRIVER_EN_ROUTE, label: 'در مسیر مبدا' },
    { value: OrderStatus.DRIVER_ASSIGNED, label: 'راننده تخصیص یافته' },
    { value: OrderStatus.FINISHED, label: 'پایان یافته' },
    { value: OrderStatus.CANCELED, label: 'لغو شده' },
];

 
// ---------------- OrderListModal Component ----------------

interface OrderListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const OrderListModal: React.FC<OrderListModalProps> = ({ isOpen, onClose }) => {
    const { currentUser } = useAuthStore();
    const [companyID, setCompanyID] = useState<string | null>(null);

    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
    
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // برای باز کردن مودال جزئیات

    // 1. Load CompanyID and Orders
    useEffect(() => {
        if (!isOpen || !currentUser) return;

        const loadData = async () => {
            setLoading(true);
            try {
                let comp = await getCompanyByUserId(currentUser.id);
                if (!comp) {
                    comp = await createCompany(currentUser.id, CompanyType.REAL);
                }
                const cID = comp.id;
                setCompanyID(cID);

                const res = await getCompanyOrders(cID);
                setAllOrders(res || []);
            } catch (err) {
                console.error("Error loading company or orders:", err);
                setAllOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isOpen, currentUser]);

    // 2. Filtered and Searched Orders
    const filteredOrders = useMemo(() => {
        return allOrders
            .filter(order => {
                // Filter by Status
                if (filterStatus !== 'ALL' && order.status !== filterStatus) {
                    return false;
                }
                // Search by Query (City, GoodType, ID)
                if (searchQuery.length < 2) return true; // Ignore short searches
                const query = searchQuery.toLowerCase();
                return (
                    order.originCity.toLowerCase().includes(query) ||
                    order.destinationCity.toLowerCase().includes(query) ||
                    order.goodType.toLowerCase().includes(query) ||
                    order.id.toLowerCase().includes(query)
                );
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort by newest
    }, [allOrders, filterStatus, searchQuery]);

    const handleOrderUpdate = (updatedOrder: Order) => {
        setAllOrders(prev => prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)));
    };
    
    if (!isOpen) return null;

    return (
        // Modal Wrapper
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-start overflow-y-auto p-4 md:p-8" dir="rtl">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg min-h-full sm:min-h-[90vh] mt-4 sm:mt-8 relative transition-all duration-300 transform scale-100 opacity-100">
                
                {/* Modal Header */}
                <div className="p-4 sm:p-6 sticky top-0 bg-white border-b z-10 rounded-t-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Truck className="text-blue-600 w-6 h-6" /> لیست سفارشات شما
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="space-y-3">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="جستجو (مبدا، مقصد، کالا، کد سفارش)"
                                className="w-full p-3 pr-10 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        
                        {/* Status Filters */}
                        <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-1">
                            {statusFilters.map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value)}
                                    className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                                        filterStatus === filter.value 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Body: Order List */}
                <div className="p-4 sm:p-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-10">
                            <Loader2 className="animate-spin inline-block w-6 h-6 text-blue-600" />
                            <p className="mt-2 text-gray-600">در حال بارگذاری سفارشات...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                            <FileText className="inline-block w-8 h-8 mb-2" />
                            <p className="font-medium">سفارشی یافت نشد.</p>
                            <p className="text-sm">فیلترها یا جستجو را تغییر دهید.</p>
                        </div>
                    ) : (
                        filteredOrders.map((o) => (
                            <div 
                                key={o.id} 
                                className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                                onClick={() => setSelectedOrder(o)} // باز کردن مودال جزئیات
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-extrabold text-gray-800 text-lg">
                                        {o.goodType}
                                    </h4>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusLabel(o.status).color} flex-shrink-0`}>
                                        {getStatusLabel(o.status).label}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        <span>مسیر: {o.originCity} ← {o.destinationCity}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-1 border-t mt-2">
                                        <span>{o.weight} {o.weightType} | {new Date(o.createdAt).toLocaleDateString('fa-IR')}</span>
                                        <button className="text-blue-600 font-medium flex items-center gap-1">
                                            <Eye className="w-4 h-4" /> جزئیات و اقدام
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Order Action Modal (Nested) */}
            {selectedOrder && (
                <OrderActionModal
                    order={selectedOrder}
                    companyID={companyID}
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onOrderUpdate={handleOrderUpdate}
                />
            )}
        </div>
    );
};

export default OrderListModal;

// ---------------- OrderManagement Component (Wrapper) ----------------

/*
این یک کامپوننت ساده است که در صفحه اصلی شما (مثلاً در داشبورد) قرار می‌گیرد
و وظیفه‌اش فقط مدیریت وضعیت باز بودن مودال اصلی است.
*/

export const OrderManagementWrapper: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // در اینجا می‌توانید دکمه‌ای برای باز کردن مودال اضافه کنید:
    return (
        <div>
            <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
            >
                <FileText className="w-6 h-6" /> مشاهده و مدیریت سفارشات
            </button>
            
            <OrderListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

// ----------------------------------------------------------------------
// توجه: برای سادگی، شما باید کامپوننت‌های OrderActionModal و توابع کمکی آن را جداگانه تعریف کنید.
// ----------------------------------------------------------------------