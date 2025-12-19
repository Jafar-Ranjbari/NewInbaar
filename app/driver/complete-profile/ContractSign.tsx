
"use client"
import React, { useState } from 'react';
// // import Headerinbaar from '@/app/components/Inbaar/Headerinbaar';


const ContractSign = ({ onNext }: { onNext: () => void }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>

      <div className="w-full max-w-sm h-[812px] md:h-[90vh] md:max-h-[812px] mx-auto bg-white flex flex-col shadow-lg rounded-lg">

        <header className="p-4 text-center">
          {/* <Headerinbaar /> */}
        </header>

        <main className="flex-grow p-6 overflow-y-auto text-right">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">قرارداد و شرایط</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            برای استفاده از خدمات اینبار، لطفا شرایط و قرارداد را مطالعه و به صورت دیجیتال امضا نمایید.
          </p>

          <div className="space-y-5 text-gray-700 text-sm leading-loose">
            <p>
              این قرارداد بین راننده محترم (کاربر اپلیکیشن) و شرکت ارائه دهنده خدمات حمل بار "اینبار" منعقد می‌گردد. با پذیرش این قرارداد، راننده متعهد می‌شود شرایط زیر را رعایت نماید.
            </p>
            <p>
              <strong>استفاده صحیح از اپلیکیشن:</strong> راننده متعهد است از اپلیکیشن اینبار صرفاً در چارچوب قوانین کشور و برای حمل قانونی بار استفاده نماید.
            </p>
            <p>
              <strong>تحویل ایمن بار:</strong> راننده مسئولیت حفظ سلامت، امنیت و تحویل به موقع بار را بر عهده دارد و موظف است طبق اطلاعات ثبت شده در سفارش عمل نماید.
            </p>
            <p>
              <strong>دریافت و تسویه مالی:</strong> کلیه پرداخت‌ها و کمیسیون‌های مربوط به سفرها مطابق نرخ‌های اعلامی اپلیکیشن محاسبه و پرداخت می‌شود.
            </p>
            <p>
              <strong>عدم سوء استفاده:</strong> هرگونه سوء استفاده از سیستم، ارتباط مستقیم با مشتری بدون هماهنگی اپلیکیشن، یا ارائه اطلاعات نادرست ممنوع بوده و پیگرد قانونی دارد.
            </p>

          </div>
        </main>

        <footer className="p-2 bg-white ">
          <div className="text-xs text-gray-500 text-right mb-4 leading-relaxed">
            <p>با زدن دکمه زیر شما تایید می کنید که شرایط بالا را خوانده اید و با آن موافق هستید.</p>
          </div>
          <div className="flex items-center justify-start mb-4">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="w-5 h-5 mr-3 text-gray-800 bg-gray-100 border-gray-400 rounded focus:ring-gray-700 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="terms-checkbox" className="text-gray-800  text-sm cursor-pointer select-none ">
              می پذیرم و ادامه می دهم
            </label>

          </div>

          <button onClick={onNext} disabled={!isChecked}

            className={`w-full py-3 px-4 rounded-lg text-lg font-bold transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2
            ${isChecked
                ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}>
            تایید
          </button>
        </footer>
      </div>


    </>
  );
};

export default ContractSign;







