 "use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { AuthStep } from "@/app/types";
import { PhoneInputStep } from "./PhoneInputStep";
import { PasswordStep } from "./PasswordStep";
import { RegisterStep } from "./RegisterStep";
import { ForgotPasswordFlow } from "./ForgotPasswordFlow";
import { SmsVerification } from "./SmsVerification";
import { Dashboard } from "../user/Dashboard";

const landingSetp: React.FC = () => {
  const { isAuthenticated, currentStep, token } = useAuthStore();
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      setRestoring(false);
    };
    restoreSession();
  }, [token]);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  const store = useAuthStore.getState();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      
      {currentStep === AuthStep.PHONE_INPUT && <PhoneInputStep />}

      {currentStep === AuthStep.LOGIN_PASSWORD && <PasswordStep />}

      {currentStep === AuthStep.REGISTER && <RegisterStep />}

      {/* 🔥 NEW USERS SMS FLOW */}
      {currentStep === AuthStep.SMS_VERIFICATION && (
        <SmsVerification
          mobile={store.tempUser?.mobile}
          onBack={() => store.setStep(AuthStep.PHONE_INPUT)}
          onSuccess={() => store.setStep(AuthStep.REGISTER)}   // ⬅️ AFTER SMS → REGISTER STEP
        />
      )}

      {/* 🔥 FORGOT PASSWORD SMS */}
      {currentStep === AuthStep.FORGOT_PASSWORD_SMS && (
        <SmsVerification
          mobile={store.tempUser?.mobile}
          onBack={() => store.setStep(AuthStep.LOGIN_PASSWORD)}
          onSuccess={() => store.setStep(AuthStep.FORGOT_PASSWORD_NEW)}
        />
      )}

      {currentStep === AuthStep.FORGOT_PASSWORD_NEW && (
        <ForgotPasswordFlow />
      )}

    </div>
  );
};

export default landingSetp;
