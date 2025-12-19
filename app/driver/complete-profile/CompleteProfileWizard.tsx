"use client"
import { useState } from 'react';
// import WalletCharge from './WalletCharge';
import ContractSign from './ContractSign';
import CarInfo from './CarInfo';
import FinishProfile from './FinishProfile';
import DriverInfo from './DriverInfo';

const CompleteProfileWizard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-4 shadow">
      {step === 1 && <DriverInfo onNext={() => setStep(2)} />}
      {step === 2 && <CarInfo onNext={() => setStep(3)} />}
      {step === 3 && <ContractSign onNext={() => setStep(4)} />}
      {/* {step === 4 && <WalletCharge onFinish={() => setStep(5)} />} */}
      {step === 4 && <FinishProfile />}
    </div>
  );
};

export default CompleteProfileWizard ;