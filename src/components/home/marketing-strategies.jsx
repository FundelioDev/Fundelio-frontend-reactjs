import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, Target, Video, 
  Users, Zap, Mail, Layers
} from 'lucide-react';

const MarketingStrategiesPage = () => {
  const strategies = [
    {
      id: "01",
      icon: Users,
      title: "Xây dựng cộng đồng Pre-launch",
      content: "Đừng đợi đến ngày ra mắt mới tìm kiếm người ủng hộ. Hãy tạo Landing Page thu thập email ít nhất 2-3 tháng trước đó. Mục tiêu: Đạt 30% ngân sách ngay trong 48h đầu tiên."
    },
    {
      id: "02",
      icon: Video,
      title: "Video Pitch chất lượng cao",
      content: "Video là thứ đầu tiên Backer xem. Nó cần ngắn gọn (dưới 3 phút), kể được câu chuyện đầy cảm xúc, minh họa sản phẩm rõ ràng và có lời kêu gọi hành động (CTA) mạnh mẽ."
    },
    {
      id: "03",
      icon: Target,
      title: "Quảng cáo Facebook & Lookalike",
      content: "Sử dụng dữ liệu email thu được từ giai đoạn Pre-launch để tạo tệp đối tượng tương tự (Lookalike) trên Facebook, giúp tiếp cận những người có hành vi mua hàng tương đồng."
    },
    {
      id: "04",
      icon: Zap,
      title: "Tạo sự khan hiếm (Scarcity)",
      content: "Thiết lập các gói 'Super Early Bird' với số lượng có hạn. Đồng hồ đếm ngược và thanh số lượng giảm dần sẽ kích thích tâm lý sợ bỏ lỡ (FOMO)."
    },
    {
      id: "05",
      icon: Mail,
      title: "Email Marketing kể chuyện",
      content: "Đừng chỉ gửi mail bán hàng. Hãy gửi chuỗi email kể về hành trình, những khó khăn, và hậu trường (Behind the scenes) để biến người lạ thành Fan trung thành."
    },
    {
      id: "06",
      icon: Layers,
      title: "Cross-Promotion (Quảng bá chéo)",
      content: "Hợp tác với các Creator khác đang chạy chiến dịch (không phải đối thủ trực tiếp). Bạn giới thiệu họ trong bản tin cập nhật của mình và ngược lại."
    }
  ];

  return (
    <div className="min-h-screen pt-24 transition-colors duration-300 ease-in-out bg-white text-gray-900 dark:bg-slate-950 dark:text-white font-sans selection:bg-cyan-500/30">
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <main className="lg:col-span-8">
          
          <header className="mb-12 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 
                            bg-cyan-100 text-cyan-800 
                            dark:bg-cyan-900/30 dark:text-cyan-400">
              <Target className="w-3 h-3" /> Marketing Guide
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              10 Chiến lược Marketing <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500">
                  Bùng Nổ Doanh Số
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm 
                            text-gray-600 border-gray-200 
                            dark:text-gray-400 dark:border-gray-800 border-b pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">F</div>
                <span className="font-bold text-gray-900 dark:text-white">Fundelio Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 28/11/2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 10 phút đọc
              </div>
            </div>
          </header>

          <div className="mb-10 p-6 rounded-2xl border 
                          bg-gray-50 border-gray-200 text-gray-800
                          dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200">
              <p className="text-lg font-medium italic leading-relaxed">
                  "Sản phẩm tốt chỉ là điều kiện cần. Marketing đúng cách mới là điều kiện đủ để biến ý tưởng thành hiện thực. Dưới đây là lộ trình đã được kiểm chứng."
              </p>
          </div>

          <div className="space-y-12">
              {strategies.map((item) => (
                  <div key={item.id} className="group">
                      <h2 className="text-2xl font-bold mb-4 flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 font-mono text-lg border 
                                         bg-gray-100 text-cyan-700 border-gray-200
                                         dark:bg-slate-800 dark:text-cyan-400 dark:border-slate-700">
                              {item.id}
                          </span>
                          <span className="mt-1 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                              {item.title}
                          </span>
                      </h2>
                      <div className="pl-14 text-lg leading-relaxed 
                                    text-gray-700 
                                    dark:text-gray-300">
                          {item.content}
                      </div>
                  </div>
              ))}
          </div>

          <div className="mt-16 pt-10 border-t 
                          border-gray-200 
                          dark:border-slate-800">
              <h3 className="text-2xl font-bold mb-4">Kết luận</h3>
              <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
                Marketing cho Crowdfunding là một cuộc chạy đua nước rút. Bạn cần chuẩn bị kỹ lưỡng trước khi tiếng còi khai cuộc vang lên.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#Marketing', '#Startup', '#Crowdfunding'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors 
                                           bg-gray-200 text-gray-800 hover:bg-gray-300
                                           dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
          </div>
        </main>

        <aside className="lg:col-span-4 space-y-8">
          
          <div className="rounded-2xl p-8 text-center sticky top-24 border shadow-xl transition-all 
                          bg-white border-cyan-100 shadow-cyan-100/50
                          dark:bg-slate-900 dark:border-cyan-500/20 dark:shadow-none">
            
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6
                            bg-cyan-100 text-cyan-700
                            dark:bg-cyan-900/30 dark:text-cyan-400">
              <Zap className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Sẵn sàng gọi vốn?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Áp dụng ngay các chiến lược này trên nền tảng Fundelio để biến ý tưởng thành hiện thực.
            </p>
            
            <Link to="/campaigns/create" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              Tạo Chiến Dịch Ngay <ArrowRight className="inline w-5 h-5 ml-1"/>
            </Link>
          </div>

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

          <div className="p-6 rounded-2xl border transition-colors 
                          bg-white border-gray-200 
                          dark:bg-slate-900 dark:border-slate-800">
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Mục lục nhanh</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {strategies.map(s => (
                      <li key={s.id} className="cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-1">
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

export default MarketingStrategiesPage;