import React, { useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { updateUserPassword } from "@/app/services/userService";
import { generateMockJwt } from "@/app/utils/cookie";
import { KeyRound, Loader2 } from "lucide-react";

export const ForgotPasswordFlow: React.FC = () => {
  const { tempUser, login } = useAuthStore();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUser) return;

    setLoading(true);
    try {
      const updatedUser = await updateUserPassword(tempUser.id, newPassword);

      const token = generateMockJwt({
        id: updatedUser.id,
        role: updatedUser.rolename,
      });

      login(updatedUser, token);
    } catch (error) {
      alert("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">رمز عبور جدید</h2>
        <p className="text-gray-500 mt-2 text-sm">
          لطفا رمز عبور جدید خود را وارد کنید
        </p>
      </div>

      <form onSubmit={handleNewPasswordSubmit}>
        <input
          type="password"
          dir="ltr"
          placeholder="رمز عبور جدید"
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-6"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "ذخیره و ورود"}
        </button>
      </form>
    </div>
  );
};
