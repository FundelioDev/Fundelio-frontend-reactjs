"use client";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, Megaphone, BarChart3, 
  Truck, ArrowRight, BadgeDollarSign, 
  ShieldCheck, Wallet, Percent, Gift
} from "lucide-react";

const LaunchGuidePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(matchMedia.matches);
    const listener = (e) => setDarkMode(e.matches);
    matchMedia.addEventListener("change", listener);
    return () => matchMedia.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(85), 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Dashboard thời gian thực",
      desc: "Theo dõi dòng tiền, lượng backer và traffic đổ về chiến dịch từng giây. Dữ liệu giúp bạn điều chỉnh chiến lược marketing kịp thời.",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      icon: Megaphone,
      title: "Công cụ Update mạnh mẽ",
      desc: "Gửi thông báo tiến độ qua email và notification cho tất cả backer chỉ với 1 cú click. Giữ lửa cho cộng đồng là chìa khóa thành công.",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/30",
    },
    {
      icon: Truck,
      title: "Quản lý Vận đơn (Fulfillment)",
      desc: "Xuất danh sách backer, phân loại gói quà tặng (rewards) và tích hợp các đơn vị vận chuyển để trả quyền lợi dễ dàng.",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/30",
    },
  ];

  const processSteps = [
    {
      icon: ShieldCheck,
      title: "Xác thực thành công",
      desc: "Hệ thống xác nhận mục tiêu đã hoàn thành. Lệnh giải tỏa tiền từ Kho tạm giữ (nơi lưu tiền ủng hộ) được kích hoạt.",
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400"
    },
    {
      icon: Percent,
      title: "Khấu trừ phí sàn",
      desc: "Hệ thống tự động tất toán quỹ, trừ đi 5% phí nền tảng. 95% số tiền còn lại sẵn sàng để chuyển đi.",
      color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400"
    },
    {
      icon: Wallet,
      title: "Về Ví trong 1-3 ngày",
      desc: "Tiền thực nhận được chuyển thẳng vào Ví Creator của bạn chỉ sau 1-3 ngày. Bạn có thể rút về Bank tùy ý.",
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
    },
    {
      icon: Gift,
      title: "Thực hiện cam kết",
      desc: "Sử dụng nguồn vốn để sản xuất và gửi quà tặng (Rewards) cho Backer theo đúng lộ trình.",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
    }
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-500">
        
        <div className="relative pt-24 sm:pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
          
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 mb-6 border border-green-200 dark:border-green-800">
              <Rocket className="w-4 h-4 mr-2 fill-current" /> Bước 3: Cán đích thành công
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
              Khởi chạy, Quản lý & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                Hiện thực hóa Giấc mơ
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Đây là khoảnh khắc của sự thật. Fundelio cung cấp mọi công cụ bạn cần để biến sự ủng hộ thành nguồn lực thực tế.
            </p>
          </div>
        </div>

        <div className="py-12 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${item.bg} ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quy trình giải ngân & Vận hành
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Minh bạch dòng tiền, tối ưu thời gian để bạn tập trung vào sản phẩm.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-10 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -z-10 rounded-full">
               <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-yellow-500 w-3/4 rounded-full opacity-30"></div> 
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-950 shadow-lg relative z-10 ${step.color} transition-transform group-hover:scale-110 duration-300`}>
                      <step.icon className="w-8 h-8" />
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                    </div>

                    {index < processSteps.length - 1 && (
                      <div className="md:hidden text-gray-300 mb-4">
                        <ArrowRight className="w-6 h-6 rotate-90" />
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="py-16 px-6 bg-yellow-50/50 dark:bg-gray-900/30 border-t border-yellow-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Đừng chờ đợi nữa. Ý tưởng của bạn xứng đáng được tỏa sáng.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/campaigns/create"
                className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all shadow-lg flex items-center justify-center"
              >
                <BadgeDollarSign className="w-5 h-5 mr-2" /> Tạo chiến dịch ngay
              </Link>
              <Link 
                to="/home"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LaunchGuidePage;