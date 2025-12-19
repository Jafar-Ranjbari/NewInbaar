"use client"
import { useState } from 'react';
import ContractSign from './ContractSign';
import FinishProfile from './FinishProfile';
import InfoCompany from './infoCompany/InfoComapny';

const CompleteProfileWizard = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-4 shadow">
      {step === 1 && <InfoCompany onNext={() => setStep(2)} />}
      {step === 2 && <ContractSign onNext={() => setStep(3)} />}
      {step === 3 && <FinishProfile />}
    </div>
  );
};

export default CompleteProfileWizard ;