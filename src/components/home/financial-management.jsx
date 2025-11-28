import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, DollarSign, Truck, 
  Package, Calculator, FileText, AlertTriangle
} from 'lucide-react';

const FinanceFulfillmentPage = () => {

  // Dữ liệu nội dung: Các bước quản lý
  const steps = [
    {
      id: "01",
      icon: Calculator,
      title: "Quy tắc 'Buffer' 20% (Dự phòng)",
      content: "Lỗi sơ đẳng nhất của Founder là tính giá thành quá sát thực tế. Giá nguyên vật liệu tăng, tỷ giá thay đổi, lô hàng bị lỗi... Hãy luôn cộng thêm 15-20% biên độ an toàn vào giá vốn (COGS) để không bị lỗ ngược khi sản xuất."
    },
    {
      id: "02",
      icon: DollarSign,
      title: "Đừng quên các loại 'Phí ẩn'",
      content: "Số tiền bạn raise được không phải là số tiền bạn cầm về. Hãy trừ đi: Phí nền tảng (5%), Phí xử lý thanh toán (2.5-3%), Thuế thu nhập/VAT, và chi phí Marketing. Thực tế bạn chỉ cầm về khoảng 70-80% số tiền hiển thị."
    },
    {
      id: "03",
      icon: Truck,
      title: "Chiến lược Vận chuyển (Shipping)",
      content: "Đừng bao giờ Free Ship toàn cầu trừ khi bạn đã tính nó vào giá bán. Lời khuyên: Hãy thu phí ship SAU khi chiến dịch kết thúc (thông qua Pledge Manager) để tránh rủi ro biến động giá cước vận chuyển."
    },
    {
      id: "04",
      icon: Package,
      title: "Đóng gói & Trải nghiệm Unboxing",
      content: "Bao bì không chỉ để bảo vệ sản phẩm, nó là điểm chạm thương hiệu đầu tiên. Tuy nhiên, hãy cân đối kích thước và trọng lượng. Một hộp quá khổ vài cm có thể làm tăng chi phí kho vận (Volumetric weight) lên gấp đôi."
    },
    {
      id: "05",
      icon: FileText,
      title: "Thuế và Thủ tục hải quan",
      content: "Nếu bạn ship quốc tế, hãy nắm rõ luật DDP (Delivered Duty Paid) hay DDU (Delivered Duty Unpaid). Đừng để Backer bị sốc khi nhận hàng phải đóng thêm một khoản thuế nhập khẩu khổng lồ."
    },
    {
      id: "06",
      icon: AlertTriangle,
      title: "Quản lý khủng hoảng (Delay)",
      content: "90% dự án Crowdfunding bị trễ hẹn. Đó là thực tế. Đừng im lặng. Hãy cập nhật tiến độ hàng tuần. Backer có thể tha thứ cho sự chậm trễ, nhưng họ sẽ không tha thứ cho sự lừa dối hoặc im lặng."
    }
  ];

  return (
    // Container chính: pt-24 để tránh Header che, Dark/Light mode tự động
    <div className="min-h-screen pt-24 transition-colors duration-300 ease-in-out bg-white text-gray-900 dark:bg-slate-950 dark:text-white font-sans selection:bg-emerald-500/30">
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- CỘT TRÁI: NỘI DUNG --- */}
        <main className="lg:col-span-8">
          
          {/* Header Bài Viết */}
          <header className="mb-12 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 
                            bg-emerald-100 text-emerald-800 
                            dark:bg-emerald-900/30 dark:text-emerald-400">
              <DollarSign className="w-3 h-3" /> Management Guide
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Quản Lý Tài Chính & Fulfillment: <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                  Chìa Khóa "Về Đích" An Toàn
              </span>
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm 
                            text-gray-600 border-gray-200 
                            dark:text-gray-400 dark:border-gray-800 border-b pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">F</div>
                <span className="font-bold text-gray-900 dark:text-white">Fundelio Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 08/12/2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 15 phút đọc
              </div>
            </div>
          </header>

          {/* Intro Quote Box */}
          <div className="mb-10 p-6 rounded-2xl border 
                          bg-gray-50 border-gray-200 text-gray-800
                          dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200">
              <p className="text-lg font-medium italic leading-relaxed">
                  "Gây quỹ thành công chỉ là một nửa chặng đường. Nửa còn lại là cuộc chiến thầm lặng của bảng tính Excel, hóa đơn thuế và những kiện hàng. Đừng để dự án 'chết' vì thiếu tiền mặt ngay sau khi gọi vốn thành công."
              </p>
          </div>

          {/* List Các bước (Steps) */}
          <div className="space-y-12">
              {steps.map((item) => (
                  <div key={item.id} className="group">
                      <h2 className="text-2xl font-bold mb-4 flex items-start">
                          {/* Số thứ tự */}
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 font-mono text-lg border 
                                         bg-gray-100 text-emerald-700 border-gray-200
                                         dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700">
                              {item.id}
                          </span>
                          <span className="mt-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {item.title}
                          </span>
                      </h2>
                      {/* Nội dung text */}
                      <div className="pl-14 text-lg leading-relaxed 
                                    text-gray-700 
                                    dark:text-gray-300">
                          {item.content}
                      </div>
                  </div>
              ))}
          </div>

          {/* Footer bài viết */}
          <div className="mt-16 pt-10 border-t 
                          border-gray-200 
                          dark:border-slate-800">
              <h3 className="text-2xl font-bold mb-4">Kết luận</h3>
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Fulfillment không hào nhoáng như Marketing, nhưng nó quyết định uy tín trọn đời của bạn. Hãy tính toán kỹ lưỡng từng đồng xu.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#Finance', '#Logistics', '#Shipping', '#Budgeting'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors 
                                           bg-gray-200 text-gray-800 hover:bg-gray-300
                                           dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
          </div>
        </main>

        {/* --- CỘT PHẢI: SIDEBAR --- */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* CTA Box */}
          <div className="rounded-2xl p-8 text-center sticky top-24 border shadow-xl transition-all 
                          bg-white border-emerald-100 shadow-emerald-100/50
                          dark:bg-slate-900 dark:border-emerald-500/20 dark:shadow-none">
            
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6
                            bg-emerald-100 text-emerald-700
                            dark:bg-emerald-900/30 dark:text-emerald-400">
              <Truck className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Cần đối tác vận chuyển?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Fundelio kết nối bạn với mạng lưới đối tác Logistics uy tín để tối ưu chi phí giao hàng.
            </p>
            
            <Link to="/partners/logistics" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
              Tìm Đối Tác Ngay <ArrowRight className="inline w-5 h-5 ml-1"/>
            </Link>
          </div>

          {/* Social Share */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500 dark:text-gray-400">Chia sẻ</h3>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-lg flex items-center justify-center transition-all 
                                 bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white
                                 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-blue-600 dark:hover:text-white">
                  <Facebook className="w-5 h-5"/>
              </button>
              <button className="flex-1 py-3 rounded-lg flex items-center justify-center transition-all 
                                 bg-gray-100 text-gray-600 hover:bg-sky-500 hover:text-white
                                 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-sky-500 dark:hover:text-white">
                  <Twitter className="w-5 h-5"/>
              </button>
              <button className="flex-1 py-3 rounded-lg flex items-center justify-center transition-all 
                                 bg-gray-100 text-gray-600 hover:bg-blue-700 hover:text-white
                                 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-blue-700 dark:hover:text-white">
                  <Linkedin className="w-5 h-5"/>
              </button>
            </div>
          </div>

          {/* Mục lục Mini */}
          <div className="p-6 rounded-2xl border transition-colors 
                          bg-white border-gray-200 
                          dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Nội dung chính</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {steps.map(s => (
                      <li key={s.id} className="cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1">
                          {s.id}. {s.title}
                      </li>
                  ))}
              </ul>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default FinanceFulfillmentPage;