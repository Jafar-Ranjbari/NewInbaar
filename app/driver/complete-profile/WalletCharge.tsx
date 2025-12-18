const WalletCharge = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <>
      <h2 className="font-bold text-lg mb-4">شارژ کیف پول</h2>
      <input placeholder="مبلغ (ریال)" className="input" />
      <button onClick={onFinish} className="btn-primary mt-4">
        پرداخت و ادامه
      </button>
    </>
  );
};
export default WalletCharge ;  