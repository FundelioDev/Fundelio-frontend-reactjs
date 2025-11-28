import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, Brain, Heart, 
  Users, Sparkles, Shield, Hourglass
} from 'lucide-react';

const PsychologyOfBackingPage = () => {

  const steps = [
    {
      id: "01",
      icon: Hourglass,
      title: "FOMO (Hội chứng sợ bỏ lỡ)",
      content: "Đây là động lực mạnh mẽ nhất. Khi Backer thấy một gói quà tặng ghi 'Chỉ còn 3 suất' hoặc 'Ưu đãi kết thúc sau 2 giờ', não bộ sẽ kích hoạt trạng thái khẩn cấp. Hãy sử dụng các gói 'Super Early Bird' giới hạn số lượng để tạo ra sự khan hiếm nhân tạo này."
    },
    {
      id: "02",
      icon: Users,
      title: "Hiệu ứng đám đông (Social Proof)",
      content: "Con người có xu hướng tin tưởng vào quyết định của số đông. Một chiến dịch đã đạt 100% vốn sẽ dễ dàng thu hút thêm người mới hơn là chiến dịch chỉ đạt 10%. Đó là lý do bạn cần 'nhồi' vốn từ người thân, bạn bè ngay trong 24h đầu tiên để tạo đà."
    },
    {
      id: "03",
      icon: Heart,
      title: "Kết nối cảm xúc (Storytelling)",
      content: "Người ta không mua 'cái khoan', họ mua 'cái lỗ trên tường'. Tương tự, Backer không chỉ mua sản phẩm, họ mua câu chuyện và giấc mơ của bạn. Hãy cho họ thấy sự đam mê, khó khăn và lý tưởng của bạn để kích hoạt sự đồng cảm."
    },
    {
      id: "04",
      icon: Sparkles,
      title: "Định danh bản thân (Identity)",
      content: "Hành động ủng hộ (Backing) là một cách để thể hiện 'Tôi là ai'. Một người ủng hộ dự án môi trường muốn khẳng định mình là người yêu thiên nhiên. Hãy thiết kế nội dung sao cho Backer cảm thấy tự hào khi được thuộc về cộng đồng của bạn."
    },
    {
      id: "05",
      icon: Shield,
      title: "Giảm thiểu rủi ro (Risk Reduction)",
      content: "Crowdfunding vốn dĩ đầy rủi ro. Để thuyết phục người lạ chuyển tiền, bạn cần các 'tín hiệu tin cậy' (Trust Signals): Video quay thực tế sản phẩm hoạt động (không phải 3D render), profile LinkedIn rõ ràng của Founder, hoặc cam kết hoàn tiền."
    },
    {
      id: "06",
      icon: Brain,
      title: "Hiệu ứng IKEA (Quyền sở hữu)",
      content: "Chúng ta thường yêu thích những gì mình góp phần tạo ra. Hãy cho Backer tham gia vào quá trình phát triển: Bình chọn màu sắc, đặt tên cho tính năng. Khi họ cảm thấy mình là 'đồng sáng tạo', họ sẽ trung thành tuyệt đối."
    }
  ];

  return (
    <div className="min-h-screen pt-24 transition-colors duration-300 ease-in-out bg-white text-gray-900 dark:bg-slate-950 dark:text-white font-sans selection:bg-violet-500/30">
      
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <main className="lg:col-span-8">
          
          <header className="mb-12 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 
                            bg-violet-100 text-violet-800 
                            dark:bg-violet-900/30 dark:text-violet-400">
              <Brain className="w-3 h-3" /> Consumer Psychology
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Tâm Lý Học Đằng Sau <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400">
                  Quyết Định Ủng Hộ
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm 
                            text-gray-600 border-gray-200 
                            dark:text-gray-400 dark:border-gray-800 border-b pb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-xs">F</div>
                <span className="font-bold text-gray-900 dark:text-white">Fundelio Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> 10/12/2025
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 12 phút đọc
              </div>
            </div>
          </header>

          <div className="mb-10 p-6 rounded-2xl border 
                          bg-gray-50 border-gray-200 text-gray-800
                          dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200">
              <p className="text-lg font-medium italic leading-relaxed">
                  "Tại sao một người lạ lại sẵn sàng chuyển tiền cho một ý tưởng chưa thành hình? Câu trả lời không nằm ở tính năng sản phẩm, mà nằm sâu trong tâm lý học hành vi và nhu cầu kết nối của con người."
              </p>
          </div>

          <div className="space-y-12">
              {steps.map((item) => (
                  <div key={item.id} className="group">
                      <h2 className="text-2xl font-bold mb-4 flex items-start">
                          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 font-mono text-lg border 
                                         bg-gray-100 text-violet-700 border-gray-200
                                         dark:bg-slate-800 dark:text-violet-400 dark:border-slate-700">
                              {item.id}
                          </span>
                          <span className="mt-1 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
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
                Hiểu được tâm lý Backer giống như việc bạn nắm trong tay tấm bản đồ kho báu. Hãy sử dụng những đòn bẩy này một cách trung thực và tinh tế.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#Psychology', '#BehavioralEconomics', '#FOMO', '#SocialProof'].map(tag => (
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
                          bg-white border-violet-100 shadow-violet-100/50
                          dark:bg-slate-900 dark:border-violet-500/20 dark:shadow-none">
            
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6
                            bg-violet-100 text-violet-700
                            dark:bg-violet-900/30 dark:text-violet-400">
              <Brain className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Sẵn sàng chinh phục?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Biến những hiểu biết tâm lý này thành một chiến dịch thành công rực rỡ trên Fundelio.
            </p>
            
            <Link to="/campaigns/create" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500">
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
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">6 Đòn bẩy tâm lý</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {steps.map(s => (
                      <li key={s.id} className="cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1">
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

export default PsychologyOfBackingPage;