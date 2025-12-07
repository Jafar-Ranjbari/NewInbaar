"use client";

import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore";


export default function HeaderPanel() {
 
    const {  logout } = useAuthStore();
  // ---------------- CustomLink ----------------
interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, children, className, onClick }) => (
  <Link href={href} className={className} onClick={onClick}>
    {children}
  </Link>
);

  return (
    <header className="flex justify-between items-center pt-2">
      <h1 className="text-2xl font-bold italic text-gray-800">inbaar</h1>

      <CustomLink
        href="#"
        onClick={logout}
        className="text-red-500 hover:text-red-600 transition-colors p-1"
      >
        <FiLogOut className="w-6 h-6" />
      </CustomLink>
    </header>
  );
}
