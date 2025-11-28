"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, ShieldCheck, Zap, 
  Rocket, ArrowRight, CheckCircle2 
} from "lucide-react";

const FundelioHighlight = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(matchMedia.matches);
    const listener = (e) => setDarkMode(e.matches);
    matchMedia.addEventListener("change", listener);
    return () => matchMedia.removeEventListener("change", listener);
  }, []);

  const timelineSteps = [
    {
      title: "1. Khởi tạo Ý tưởng",
      desc: "Thiết lập hồ sơ dự án, định hình câu chuyện và xác định các gói quà tặng (rewards) hấp dẫn cho backer.",
    },
    {
      title: "2. Lan tỏa Cộng đồng",
      desc: "Sử dụng công cụ marketing tích hợp của Fundelio để tiếp cận mạng lưới nhà đầu tư thiên thần và cộng đồng ủng hộ.",
    },
    {
      title: "3. Gây quỹ & Về đích",
      desc: "Theo dõi dòng tiền theo thời gian thực. Nhận giải ngân ngay khi đạt mục tiêu (All-or-Nothing).",
    },
  ];

  const benefits = [
    {
      icon: Briefcase,
      title: "Vốn hóa không mất quyền kiểm soát",
      description: "Huy động vốn cộng đồng giúp bạn giữ 100% cổ phần (equity). Bạn bán sản phẩm/ý tưởng, không bán công ty.",
      iconContainerClass: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: ShieldCheck,
      title: "Niềm tin được bảo chứng",
      description: "Hệ thống Escrow giữ tiền an toàn. Backer được hoàn tiền 100% nếu dự án không đạt mục tiêu cam kết.",
      iconContainerClass: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Zap,
      title: "Công nghệ hỗ trợ tăng trưởng",
      description: "Dashboard phân tích dữ liệu backer, tích hợp cổng thanh toán Crypto & Fiat, hỗ trợ ship hàng toàn cầu.",
      iconContainerClass: "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-500 overflow-hidden">
        
        <div className="pt-24 sm:pt-32 pb-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 mb-6 border border-yellow-200 dark:border-yellow-800">
              <Zap className="w-4 h-4 mr-2 fill-current" /> Nền tảng Crowdfunding Thế hệ mới
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
              Biến ý tưởng thành hiện thực với <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Fundelio</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Kết nối trực tiếp với hàng triệu người ủng hộ và khởi động giấc mơ của bạn ngay hôm nay.
            </p>
          </div>
        </div>
        <div className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Tại sao chọn Fundelio?</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Hệ sinh thái toàn diện dành cho Creators và Backers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title} 
                className="group p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${benefit.iconContainerClass}`}>
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-yellow-500 transition-colors">{benefit.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 py-24 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Hành trình 3 bước đơn giản</h2>
            </div>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 md:left-1/2 md:-ml-0.5"></div>

              {timelineSteps.map((step, index) => (
                <div key={index} className={`relative flex items-center mb-12 last:mb-0 md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-0 w-16 h-16 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border-4 border-yellow-400 shadow-lg z-10 md:static md:w-16 md:h-16 md:flex-shrink-0">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{index + 1}</span>
                  </div>
                  
                  <div className="ml-24 md:ml-0 md:w-[42%] p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-500 transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-yellow-500 dark:to-orange-600 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <h2 className="relative text-3xl sm:text-5xl font-extrabold text-white mb-6">
              Bạn đã sẵn sàng tạo nên lịch sử?
            </h2>
            <p className="relative text-lg text-gray-300 dark:text-white/90 mb-10 max-w-2xl mx-auto">
              Đừng để ý tưởng tuyệt vời chỉ nằm trên giấy. Hãy để Fundelio giúp bạn mang nó đến với thế giới.
            </p>
            
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              
              <Link 
                to="/campaigns/create"
                className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center dark:bg-white dark:text-orange-600"
              >
                <Rocket className="w-5 h-5 mr-2" /> Bắt đầu dự án
              </Link>
              
              <Link 
                to="/search"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Khám phá dự án <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

            </div>
            
            <div className="relative mt-8 flex justify-center items-center gap-2 text-sm text-gray-400 dark:text-white/80">
                <CheckCircle2 className="w-4 h-4 text-green-400 dark:text-white" /> 
                <span>Đăng ký miễn phí. Không cần thẻ tín dụng.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FundelioHighlight;