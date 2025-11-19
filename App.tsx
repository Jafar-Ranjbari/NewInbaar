import React, { useEffect, useState } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { AuthStep } from './types';
import { PhoneInputStep } from './components/auth/PhoneInputStep';
import { PasswordStep } from './components/auth/PasswordStep';
import { RegisterStep } from './components/auth/RegisterStep';
import { ForgotPasswordFlow } from './components/auth/ForgotPasswordFlow';
import { Dashboard } from './components/dashboard/Dashboard';
import { getUserByMobile } from './services/userService';
import { generateMockJwt } from './utils/cookie';

const App: React.FC = () => {
  const { isAuthenticated, currentStep, token, login } = useAuthStore();
  const [restoring, setRestoring] = useState(true);

  // Restore session logic (Mocking /me endpoint behavior)
  useEffect(() => {
    const restoreSession = async () => {
      // In a real app, we would call axios.get('/me') using the token
      // Here we just decode the mock token or assume user needs to relogin if we didn't persist user object
      // For this demo, if token exists but no user, we force logout or simplistic restore if we had user ID
      // We will skip complex restoration for this demo and rely on State, 
      // but if refresh happens, the store is cleared.
      // Practical fix for demo: Check localStorage or just let them login again if state is lost.
      
      setRestoring(false);
    };
    restoreSession();
  }, [token]);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      
      {/* Warning Banner for DB Setup */}
      <div className="fixed top-0 left-0 w-full bg-orange-100 text-orange-800 text-center text-xs p-1 border-b border-orange-200">
        اطمینان حاصل کنید که <code>json-server --watch db.json</code> در پورت 3000 اجرا شده باشد.
      </div>

      {/* Render specific auth step based on state */}
      {currentStep === AuthStep.PHONE_INPUT && <PhoneInputStep />}
      {currentStep === AuthStep.LOGIN_PASSWORD && <PasswordStep />}
      {currentStep === AuthStep.REGISTER && <RegisterStep />}
      {(currentStep === AuthStep.FORGOT_PASSWORD_SMS || currentStep === AuthStep.FORGOT_PASSWORD_NEW) && (
        <ForgotPasswordFlow />
      )}
    </div>
  );
};

export default App;