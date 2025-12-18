const CarInfo = ({ onNext }: { onNext: () => void }) => {
  return (
    <>
      <h2 className="font-bold text-lg mb-4">مشخصات خودرو</h2>
      <input placeholder="مدل خودرو" className="input" />
      <input placeholder="پلاک" className="input mt-2" />
      <button onClick={onNext} className="btn-primary mt-4">مرحله بعد</button>
    </>
  );
};


export default CarInfo ;