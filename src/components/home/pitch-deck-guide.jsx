import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Share2, 
  Facebook, Twitter, Linkedin, 
  ArrowRight, Presentation, PieChart, 
  Users, TrendingUp, Target, Briefcase
} from 'lucide-react';

const PitchDeckGuidePage = () => {
  const steps = [
    {
      id: "01",
      icon: Target,
      title: "The Hook (Vấn đề & Thu hút)",
      content: "Nhà đầu tư không có nhiều thời gian. Hãy bắt đầu bằng một 'nỗi đau' cụ thể của thị trường và cách giải quyết hiện tại đang thất bại như thế nào. Bạn cần khiến họ gật đầu ngay trong 30 giây đầu tiên."
    },
    {
      id: "02",
      icon: Presentation,
      title: "Giải pháp & Sản phẩm (The Solution)",
      content: "Đừng chỉ liệt kê tính năng. Hãy trình bày giá trị cốt lõi (Value Proposition). Sản phẩm của bạn giải quyết 'nỗi đau' ở bước 1 nhanh hơn, rẻ hơn hay tốt hơn như thế nào?"
    },
    {
      id: "03",
      icon: PieChart,
      title: "Quy mô thị trường (Market Size)",
      content: "Sử dụng mô hình TAM-SAM-SOM để chứng minh tiềm năng tăng trưởng. Nhà đầu tư muốn thấy một thị trường đủ lớn (Hàng tỷ $) để khoản đầu tư của họ có thể nhân lên gấp 10-100 lần."
    },
    {
      id: "04",
      icon: Briefcase,
      title: "Mô hình kinh doanh (Business Model)",
      content: "Bạn kiếm tiền bằng cách nào? (Bán lẻ, Subscription, Freemium...?). Hãy đưa ra các chỉ số kinh tế đơn vị (Unit Economics) rõ ràng để chứng minh tính bền vững."
    },
    {
      id: "05",
      icon: TrendingUp,
      title: "Traction (Kết quả thực tế)",
      content: "Ý tưởng thì rẻ, thực thi mới đắt. Hãy show những con số thực tế: Doanh thu, lượng người dùng active hàng tháng (MAU), hoặc các đối tác chiến lược đã ký kết."
    },
    {
      id: "06",
      icon: Users,
      title: "Đội ngũ (The Team)",
      content: "Tại sao lại là các bạn chứ không phải ai khác? Làm nổi bật kinh nghiệm, kỹ năng bổ trợ lẫn nhau của các Co-founder. Nhà đầu tư rót vốn cho con người, không phải chỉ vì ý tưởng."
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
              <Presentation className="w-3 h-3" /> Fundraising Guide
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Cách Viết Pitch Deck <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-400 dark:to-blue-500">
                  Thu Hút Nhà Đầu Tư
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
                <Calendar className="w-4 h-4" /> 30/11/2025
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
                  "Pitch Deck không phải là bản thuyết trình về sản phẩm. Nó là bản thuyết trình về cơ hội kinh doanh. Mục tiêu duy nhất của Pitch Deck là có được cuộc hẹn tiếp theo."
              </p>
          </div>

          <div className="space-y-12">
              {steps.map((item) => (
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
                Một Pitch Deck xuất sắc cần sự cân bằng giữa Logic (Số liệu) và Cảm xúc (Câu chuyện). Hãy chuẩn bị thật kỹ lưỡng trước khi đứng trước "Cá Mập".
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['#PitchDeck', '#Fundraising', '#Startup', '#Investment'].map(tag => (
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
              <Presentation className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Đã có Pitch Deck?
            </h3>
            <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
              Đừng để nó nằm trong máy tính. Hãy đưa dự án lên Fundelio để tiếp cận hàng ngàn nhà đầu tư tiềm năng ngay hôm nay.
            </p>
            
            <Link to="/campaigns/create" className="block w-full py-4 font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-1 transition-all
                                                  bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
              Bắt Đầu Gọi Vốn <ArrowRight className="inline w-5 h-5 ml-1"/>
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
              <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Cấu trúc bài viết</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  {steps.map(s => (
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

export default PitchDeckGuidePage;