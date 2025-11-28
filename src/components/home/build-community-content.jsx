import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, Users, MessageCircle, 
  Heart, Gift, Megaphone, Radio
} from 'lucide-react';

const CommunityBuildingPage = () => {
  const steps = [
    {
      id: "01",
      icon: Users,
      title: "Vẽ chân dung Fan trung thành (Persona)",
      content: "Bạn không thể xây dựng cộng đồng cho 'tất cả mọi người'. Hãy xác định rõ: Họ là ai? Họ đam mê điều gì? Nỗi đau lớn nhất của họ là gì? Một cộng đồng nhỏ nhưng cuồng nhiệt (1,000 True Fans) quý giá hơn triệu người qua đường."
    },
    {
      id: "02",
      icon: Megaphone,
      title: "Landing Page & Waitlist (Danh sách chờ)",
      content: "Trước khi có sản phẩm, hãy bán 'tầm nhìn'. Tạo một Landing Page đơn giản thu thập email. Tặng họ Ebook, mã giảm giá hoặc quyền truy cập sớm (Early Access) để đổi lấy thông tin liên lạc."
    },
    {
      id: "03",
      icon: MessageCircle,
      title: "Chọn 'Ngôi nhà' cho cộng đồng",
      content: "Họ sẽ sinh hoạt ở đâu? Facebook Group (dễ tiếp cận), Discord (tương tác thời gian thực), hay Email Newsletter (riêng tư)? Hãy chọn nền tảng nơi khách hàng của bạn cảm thấy thoải mái nhất."
    },
    {
      id: "04",
      icon: Gift,
      title: "Chiến lược 'Give First' (Cho đi trước)",
      content: "Đừng vội bán hàng. Hãy chia sẻ kiến thức, hậu trường sản xuất (Behind-the-scenes), hoặc tổ chức các buổi AMA (Ask Me Anything). Giá trị bạn trao đi sẽ xây dựng niềm tin - đơn vị tiền tệ quan trọng nhất."
    },
    {
      id: "05",
      icon: Radio,
      title: "Tương tác hai chiều (Engagement)",
      content: "Đừng độc thoại. Hãy đặt câu hỏi, khảo sát ý kiến về màu sắc, tính năng sản phẩm. Khi thành viên cảm thấy họ góp phần tạo nên sản phẩm, họ sẽ trở thành những đại sứ thương hiệu nhiệt thành nhất."
    },
    {
      id: "06",
      icon: Heart,
      title: "Chương trình giới thiệu (Referral)",
      content: "Biến thành viên thành người tuyển dụng. Tạo cơ chế: 'Mời 3 bạn bè tham gia Waitlist để nhận quà độc quyền'. Hiệu ứng mạng lưới sẽ giúp cộng đồng bùng nổ tự nhiên."
    }
  ];

  return (
    <div className="min-h-screen pt-24 transition-colors duration-300 ease-in-out bg-white text-gray-900 dark:bg-slate-950 dark:text-white font-sans selection:bg-cyan-500/30">
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <main className="lg:col-span-8">
          
          <header className="mb-12 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 
                            bg-green-100 text-green-800 
                            dark:bg-green-900/30 dark:text-green-400">
              <Users className="w-3 h-3" /> Community Growth
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Xây Dựng Cộng Đồng <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400">
                  Trung Thành Trước Khi Launch
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm 
                            text-gray-600 border-gray-200 
                            dark:text-gray-400 dark:border-gray-800 border-b pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">F</div>
                <span className="font-bold text-gray-900 dark:text-white">Fundelio Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 02/12/2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 15 phút đọc
              </div>
            </div>
          </header>

          <div className="mb-10 p-6 rounded-2xl border 
                          bg-gray-50 border-gray-200 text-gray-800
                          dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200">
              <p className="text-lg font-medium italic leading-relaxed">
                  "Thành công của một chiến dịch Crowdfunding thường được định đoạt TRƯỚC ngày bấm nút ra mắt. Nếu bạn launch trước một khán phòng trống rỗng, thất bại là điều khó tránh khỏi."
              </p>
          </div>

          <div className="space-y-12">
              {steps.map((item) => (
                  <div key={item.id} className="group">
                      <h2 className="text-2xl font-bold mb-4 flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 font-mono text-lg border 
                                         bg-gray-100 text-green-700 border-gray-200
                                         dark:bg-slate-800 dark:text-green-400 dark:border-slate-700">
                              {item.id}
                          </span>
                          <span className="mt-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
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
                Cộng đồng chính là "Bảo hiểm" cho dự án của bạn. Hãy bắt đầu xây dựng nó ngay hôm nay, dù bạn chưa có sản phẩm hoàn thiện.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#CommunityBuilding', '#PreLaunch', '#Fanbase', '#Viral'].map(tag => (
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
                          bg-white border-green-100 shadow-green-100/50
                          dark:bg-slate-900 dark:border-green-500/20 dark:shadow-none">
            
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6
                            bg-green-100 text-green-700
                            dark:bg-green-900/30 dark:text-green-400">
              <Users className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Cộng đồng đã sẵn sàng?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Đừng để họ chờ lâu. Hãy khởi tạo chiến dịch trên Fundelio để biến sự ủng hộ thành nguồn vốn thực tế.
            </p>
            
            <Link to="/campaigns/create" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500">
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
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Quy trình 6 bước</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {steps.map(s => (
                      <li key={s.id} className="cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-1">
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

export default CommunityBuildingPage;