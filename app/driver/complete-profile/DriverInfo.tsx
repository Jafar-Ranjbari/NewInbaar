const DriverInfo = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
      <h2 className="font-bold text-lg mb-4">ثبت مشخصات راننده</h2>
      <input placeholder="نام و نام خانوادگی" className="input" />
      <input placeholder="کد ملی" className="input mt-2" />
      <button onClick={onNext} className="btn-primary mt-4">مرحله بعد</button>
    </>
  );
};

export default DriverInfo ;