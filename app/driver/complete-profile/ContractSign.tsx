const ContractSign = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
      <h2 className="font-bold text-lg mb-4">امضای قرارداد</h2>
      <p className="text-sm text-gray-500">
        متن قرارداد اینجا نمایش داده می‌شود
      </p>
      <button onClick={onNext} className="btn-primary mt-4">
        قرارداد را می‌پذیرم
      </button>
    </>
  );
};

export default  ContractSign  ; 