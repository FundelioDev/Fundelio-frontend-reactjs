import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, Video, Play, 
  Mic, Music, Type, MousePointerClick
} from 'lucide-react';

const VideoCampaignGuidePage = () => {
  const steps = [
    {
      id: "01",
      icon: Play,
      title: "Quy tắc 5 giây đầu tiên (The Hook)",
      content: "Khoảng chú ý của con người hiện nay còn ngắn hơn cả cá vàng. Bạn phải gây ấn tượng ngay lập tức. Đừng bắt đầu bằng Logo xoay vòng nhàm chán. Hãy bắt đầu bằng một câu hỏi sốc, một hình ảnh ấn tượng hoặc một vấn đề nhức nhối."
    },
    {
      id: "02",
      icon: Video,
      title: "Kể chuyện, đừng chỉ Bán hàng",
      content: "Đừng liệt kê thông số kỹ thuật (Specs). Hãy kể về 'Tại sao' (Why). Tại sao bạn tạo ra nó? Nó thay đổi cuộc sống người dùng thế nào? Một cấu trúc tốt là: Vấn đề -> Giải pháp -> Tác động -> Lời kêu gọi."
    },
    {
      id: "03",
      icon: Mic,
      title: "Âm thanh > Hình ảnh",
      content: "Người xem có thể tha thứ cho hình ảnh hơi rung, nhưng họ sẽ tắt ngay nếu âm thanh bị rè hoặc khó nghe. Nếu ngân sách hạn hẹp, hãy đầu tư một chiếc micro cài áo (Lavalier mic) giá rẻ thay vì nâng cấp camera."
    },
    {
      id: "04",
      icon: Type,
      title: "Phụ đề là bắt buộc (Captions)",
      content: "85% video trên mạng xã hội được xem khi tắt tiếng (Mute). Nếu không có phụ đề (Hard-coded subtitles), bạn đang bỏ lỡ phần lớn khán giả. Hãy đảm bảo font chữ to, dễ đọc trên điện thoại."
    },
    {
      id: "05",
      icon: Music,
      title: "Nhịp điệu và Cảm xúc",
      content: "Chọn nhạc nền phù hợp với tâm trạng (Mood) của video. Nhịp cắt (Edit pace) cần nhanh và dứt khoát. Một video dài lê thê 5 phút sẽ giết chết hứng thú. Độ dài vàng cho crowdfunding là 1:30s đến 2:30s."
    },
    {
      id: "06",
      icon: MousePointerClick,
      title: "CTA rõ ràng (Call to Action)",
      content: "Đừng để video kết thúc trong im lặng. Hãy nói rõ bạn muốn họ làm gì: 'Ủng hộ chúng tôi trên Fundelio ngay hôm nay để nhận ưu đãi 40%'. Hình ảnh hóa phần thưởng trong video cũng giúp tăng chuyển đổi."
    }
  ];

  return (
    <div className="min-h-screen pt-24 transition-colors duration-300 ease-in-out bg-white text-gray-900 dark:bg-slate-950 dark:text-white font-sans selection:bg-rose-500/30">
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <main className="lg:col-span-8">
          
          <header className="mb-12 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 
                            bg-rose-100 text-rose-800 
                            dark:bg-rose-900/30 dark:text-rose-400">
              <Video className="w-3 h-3" /> Creative Guide
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Tối Ưu Video Campaign <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400">
                  Để Tăng Conversion
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm 
                            text-gray-600 border-gray-200 
                            dark:text-gray-400 dark:border-gray-800 border-b pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">F</div>
                <span className="font-bold text-gray-900 dark:text-white">Fundelio Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 05/12/2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 8 phút đọc
              </div>
            </div>
          </header>

          <div className="mb-10 p-6 rounded-2xl border 
                          bg-gray-50 border-gray-200 text-gray-800
                          dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200">
              <p className="text-lg font-medium italic leading-relaxed">
                  "Video campaign đạt tỷ lệ chuyển đổi cao hơn gấp 4 lần so với chiến dịch chỉ có hình ảnh. Bạn không cần ngân sách Hollywood, bạn cần sự chân thực và chiến lược đúng đắn."
              </p>
          </div>

          <div className="space-y-12">
              {steps.map((item) => (
                  <div key={item.id} className="group">
                      <h2 className="text-2xl font-bold mb-4 flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 font-mono text-lg border 
                                         bg-gray-100 text-rose-700 border-gray-200
                                         dark:bg-slate-800 dark:text-rose-400 dark:border-slate-700">
                              {item.id}
                          </span>
                          <span className="mt-1 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
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
                Một video tốt là nhân viên bán hàng xuất sắc nhất của bạn, làm việc 24/7. Hãy dành thời gian chau chuốt kịch bản trước khi bấm máy.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#VideoProduction', '#CrowdfundingTips', '#ContentMarketing', '#Conversion'].map(tag => (
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
                          bg-white border-rose-100 shadow-rose-100/50
                          dark:bg-slate-900 dark:border-rose-500/20 dark:shadow-none">
            
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6
                            bg-rose-100 text-rose-700
                            dark:bg-rose-900/30 dark:text-rose-400">
              <Play className="w-8 h-8 ml-1" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Video đã sẵn sàng?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Tải video của bạn lên Fundelio và bắt đầu hành trình gọi vốn ngay hôm nay.
            </p>
            
            <Link to="/campaigns/create" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500">
              Tạo Chiến Dịch <ArrowRight className="inline w-5 h-5 ml-1"/>
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
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Nội dung chính</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {steps.map(s => (
                      <li key={s.id} className="cursor-pointer hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-1">
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

export default VideoCampaignGuidePage;